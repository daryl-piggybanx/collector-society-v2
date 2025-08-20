"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

import { usePostHog } from "posthog-js/react";

import { createUpdateProfile, subscribeProfileReservation } from "@/integrations/klaviyo/profiles/services"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

import { useSharedFormData } from "@/hooks/shared-data"
import { filterEmptyValues } from "@/lib/utils"

import { wallPieceRules } from "@/lib/data"

import CommunityRules from "@/components/phases/community-rules"
import MarketingConsent from "@/components/phases/marketing-consent"
import UserIdentity from "@/components/phases/user-identity"
import ShippingAddress from "@/components/phases/shipping-address"
import PieceSelection from "@/components/phases/piece-selection"

import ConfirmationPage from "@/components/phases/confirmation-page"
import { validatePhoneNumber } from "@/utils/validation"
import { validateEmail } from "@/utils/validation"

import type { FormData } from "./types"
import { initialFormData } from "./types"

const createInitialReservationFormData = (sharedData: FormData | null): FormData => {
  const baseData: FormData = {
    ...initialFormData,
    is_returning_collector: false
  };

  if (!sharedData) {
    return baseData;
  }

  // Only merge specific fields from phase 1 of OG form when redirected
  return {
    ...baseData,
    first_name: sharedData.first_name || "",
    last_name: sharedData.last_name || "",
    email: sharedData.email || "",
    phone_number: sharedData.phone_number || "",
    marketing_consent: sharedData.marketing_consent || false,
    communication_preference: sharedData.communication_preference || "",
    discord_username: sharedData.discord_username || "",
    instagram_handle: sharedData.instagram_handle || "",
    is_returning_collector: false,
    is_reservation_collector: true,
    is_discord_collector: false
  };
};

export function ReservationForm() {
  const posthog = usePostHog();
  const { sharedData, clearSharedData, setSharedData } = useSharedFormData();
  const [currentPhase, setCurrentPhase] = useState(1);
  const [formData, setFormData] = useState<FormData>(() => createInitialReservationFormData(sharedData as FormData | null));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const mutation = useMutation({
    mutationFn: createUpdateProfile,
    onSuccess: () => {
      setFormData(formData);
      setSharedData(formData);
      // console.log("Profile created/updated successfully")
    },
    onError: (error) => {
      console.error("Error creating/updating profile:", error)
    },
  });

  const mutationSubscribe = useMutation({
    mutationFn: subscribeProfileReservation,
    onSuccess: () => {
      console.log("Subscriptions processed successfully")
    },
    onError: (error) => {
      console.error("Error subscribing to reservation:", error)
    },
  });

  const totalPhases = 3;
  const progressPercentage = (currentPhase / totalPhases) * 100;

  const handleNext = () => {
    setCurrentPhase((prev) => prev + 1)
  }

  const handleBack = () => {
    setCurrentPhase((prev) => prev - 1)
  }

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      await mutation.mutateAsync({ data: formData });
      await mutationSubscribe.mutateAsync({ data: formData });
      setIsComplete(true);
      setCurrentPhase(totalPhases + 1);
      posthog.identify(formData.email);
      posthog?.capture(
        'wall_piece_reservation_success',
        {
          ...filterEmptyValues(formData),
          $set: filterEmptyValues(formData)
        }
      );

    } catch (error) {
      console.error("Error submitting form:", error);
      posthog.identify(formData.email);
      posthog?.capture(
        'wall_piece_reservation_fail',
        {
          ...filterEmptyValues(formData),
          $set: filterEmptyValues(formData)
        }
      );

    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine if the next button should be disabled
  const isNextDisabled = () => {
    switch (currentPhase) {
      case 1:
        return !formData.rules_accepted.slice(0, wallPieceRules.length).every((rule) => rule)
      case 2:
        const emailValidation = validateEmail(formData.email);
        const phoneValidation = validatePhoneNumber(formData.phone_number || "");
        return !formData.first_name || !formData.last_name || !emailValidation.isValid || !formData.shipping_address_line_1
      case 3:
        return !formData.wall_piece_1
      default:
        return false
    }
  }

  return (
    <div className="w-full max-w-3xl">
      <motion.div
        className="bg-red-950/30 backdrop-blur-sm border border-red-400/20 rounded-2xl shadow-xl overflow-hidden relative pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-8 min-h-[500px]">
          <AnimatePresence mode="wait">

            {currentPhase === 1 && (
              <CommunityRules
                key="community-rules"
                formData={formData}
                updateFormData={updateFormData}
                rules={wallPieceRules}
              />
            )}

            {currentPhase === 2 && (
              <>
                <UserIdentity key="user-identity" formData={formData} updateFormData={updateFormData} />
                <MarketingConsent key="marketing-consent" formData={formData} updateFormData={updateFormData} />
                <ShippingAddress key="shipping-address" formData={formData} updateFormData={updateFormData} />
              </>
            )}

            {currentPhase === 3 && (
              <>
                <PieceSelection key="piece-selection" formData={formData} updateFormData={updateFormData} />
              </>

            )}

            {isComplete && currentPhase === totalPhases + 1 && (
              <ConfirmationPage
                key="success"
                formData={formData}
                formType="reservation"
              />
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          {!isComplete && (
            <div className="flex justify-between mt-8">
              {currentPhase > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex items-center gap-2 bg-red-950/40 border-red-400/30 text-red-100 hover:bg-red-800/50 hover:text-red-50 cursor-pointer"
                >
                  <ChevronLeft size={16} />
                  Back
                </Button>
              )}

              {currentPhase < totalPhases && (
                <Button
                  onClick={handleNext}
                  disabled={isNextDisabled()}
                  className="ml-auto flex items-center gap-2 bg-red-600 hover:bg-red-500 cursor-pointer"
                >
                  Next
                  <ChevronRight size={16} />
                </Button>
              )}

              {currentPhase === totalPhases && (
                <Button
                  onClick={handleSubmit}
                  disabled={isNextDisabled() || isSubmitting}
                  className="ml-auto flex items-center gap-2 bg-red-600 hover:bg-red-500 text-red-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit
                      <Check size={16} />
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Progress bar */}
        {!isComplete && (
          <div className="px-8 pb-6">
            <Progress value={progressPercentage} className="h-2" />
            <div className="text-xs text-red-200/80 mt-2">
              Step {currentPhase} of {totalPhases}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
