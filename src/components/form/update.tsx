"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Check, ChevronLeft, ChevronRight, Loader2, AlertTriangle } from "lucide-react"
import { useRouter } from "@tanstack/react-router"

import { usePostHog } from "posthog-js/react";

import { getProfileByEmail, createUpdateProfile, subscribeProfile  } from "@/integrations/klaviyo/profiles/services"
import { useMutation } from "@tanstack/react-query"
import { originalCollectionPreferences, collectionPreferences, collectionVariations } from "@/lib/data"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { useSharedFormData } from "@/hooks/shared-data"
import { filterEmptyValues } from "@/lib/utils"

import CollectorPieces from "@/components/phases/collector-pieces"
import CommunityExperience from "@/components/phases/community-experience"
import MarketingConsent from "@/components/phases/marketing-consent"
import TopCategories from "@/components/phases/top-categories"
import UserIdentity from "@/components/phases/user-identity"

import SuccessPage from "@/components/phases/success-page"

import type { FormData } from "./types"
import { initialFormData } from "./types"

const createInitialUpdateProfileFormData = (sharedData: FormData | null): FormData => {
  const baseData: FormData = {
    ...initialFormData,
    is_returning_collector: true
  };

  if (!sharedData) {
    return baseData;
  }

  // simple merge - sharedData overwrites baseData properties
  return {
    ...baseData,
    ...sharedData,
    is_returning_collector: true
  };
};

export function UpdateProfileForm() {
  const posthog = usePostHog();
  const { sharedData, hasSharedData, setSharedData, clearSharedData } = useSharedFormData();
  const [formData, setFormData] = useState<FormData>(() => createInitialUpdateProfileFormData(sharedData as FormData | null));

  const [currentPhase, setCurrentPhase] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showEmailErrorDialog, setShowEmailErrorDialog] = useState(false);
  const [isValidatingEmail, setIsValidatingEmail] = useState(false);

  const router = useRouter();

  // console.log('formData', formData);

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const mutation = useMutation({
    mutationFn: createUpdateProfile,
    onSuccess: () => {
      setSharedData(formData);
      // console.log("Profile created/updated successfully")
    },
    onError: (error) => {
      console.error("Error creating/updating profile:", error)
    },
  });

  const mutationSubscribe = useMutation({
    mutationFn: subscribeProfile,
    onSuccess: () => {
      // console.log("Subscriptions processed successfully")
    },
    onError: (error) => {
      console.error("Error subscribing to profiles:", error)
    },
  });

  const totalPhases = 4;
  const progressPercentage = (currentPhase / totalPhases) * 100

  const handleNext = async () => {
    // phase 1 - validate email before proceeding
    if (currentPhase === 1) {
      setIsValidatingEmail(true);
      
      try {
        const profile = await getProfileByEmail({ data: { email: formData.email } });
        if (!profile) {
          setShowEmailErrorDialog(true);
        } else {
          setCurrentPhase((prev) => prev + 1);
        }
      } catch (error) {
        setShowEmailErrorDialog(true);
      } finally {
        setIsValidatingEmail(false);
      }
    } else {
      setCurrentPhase((prev) => prev + 1);
    }
  }

  const handleBack = () => {
    setCurrentPhase((prev) => prev - 1)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      await mutation.mutateAsync({ data: formData });
      await mutationSubscribe.mutateAsync({ data: formData });
      setIsComplete(true);
      setCurrentPhase(totalPhases + 1);
      posthog.identify(formData.email);
      posthog.capture('returning_collector_form_submission_success', {
        ...filterEmptyValues(formData),
        $set: filterEmptyValues(formData)
      });

    } catch (error) {
      console.error("Error submitting form:", error);
      posthog.identify(formData.email);
      posthog.capture('returning_collector_form_submission_fail', {
        ...filterEmptyValues(formData),
        $set: filterEmptyValues(formData)
      });

    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRedirectToNewCollectorForm = () => {
    // clear existing shared data
    clearSharedData();
    // only keep formData from phase 1
    const phase1Data: Partial<FormData> = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone_number: formData.phone_number,
      marketing_consent: formData.marketing_consent,
      communication_preference: formData.communication_preference,
      discord_username: formData.discord_username,
      instagram_handle: formData.instagram_handle,
    };
    // transfer current form data to shared data
    setSharedData(phase1Data);
    posthog.capture('returning_collector_form_redirected', filterEmptyValues(formData));
    router.navigate({ to: '/collector/new' });
  };

  // Determine if the next button should be disabled
  const isNextDisabled = () => {
    switch (currentPhase) {
      case 1:
        return !formData.first_name || !formData.last_name || !formData.email || isValidatingEmail
      case 2:
        return !formData.piece_count
      case 3:
        return formData.collect_preferences && formData.collect_preferences.length === 0
      case 4:
        return !formData.community_experience || !formData.improvements
      default:
        return false
    }
  }

  return (
    <div className="w-full max-w-3xl">
      <motion.div
        className="bg-red-950/30 backdrop-blur-sm border border-red-400/20 rounded-2xl shadow-xl overflow-hidden relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-8 min-h-[500px]">
          <AnimatePresence mode="wait">

            {currentPhase === 1 && (
              <>
                <UserIdentity key="user-identity" formData={formData} updateFormData={updateFormData} />
                <MarketingConsent key="marketing-consent" formData={formData} updateFormData={updateFormData} />
              </>
            )}

            {currentPhase === 2 && (
              <CollectorPieces
                key="collector-pieces"
                formData={formData}
                updateFormData={updateFormData}
                variations={collectionVariations}
              />
            )}

            {currentPhase === 3 && (
              <TopCategories
                key="top-categories"
                formData={formData}
                updateFormData={updateFormData}
                preferences={originalCollectionPreferences}
              />
            )}

            {currentPhase === 4 && (
              <CommunityExperience
                key="community-experience"
                formData={formData}
                updateFormData={updateFormData}
              />
            )}

            {isComplete && currentPhase === totalPhases + 1 && (
              <SuccessPage
                key="success"
                formData={formData}
                preferences={originalCollectionPreferences}
                variations={collectionVariations}
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
                  className="ml-auto flex items-center gap-2 bg-red-600 hover:bg-red-500 text-red-50 cursor-pointer"
                >
                  {isValidatingEmail ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Validating...
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight size={16} />
                    </>
                  )}
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

      {/* Email Error Alert Dialog */}
      <AlertDialog open={showEmailErrorDialog} onOpenChange={setShowEmailErrorDialog}>
        <AlertDialogContent className="bg-red-950/90 border-red-400/30 text-red-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-200">
              <AlertTriangle size={20} className="text-red-400" />
              Email Not Recognized
            </AlertDialogTitle>
            <AlertDialogDescription className="text-red-200/80">
              We couldn't find your email address in our system. This form is for returning collectors only.
              Would you like to submit a New Collector Application instead?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-red-950/40 border-red-400/30 text-red-100 hover:bg-red-800/50">
              Try Again
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRedirectToNewCollectorForm}
              className="bg-red-600 hover:bg-red-500 text-red-50 cursor-pointer"
            >
              Submit New Application
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
