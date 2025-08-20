"use client"

import { motion } from "motion/react"
import {
  CheckCircle,
  User,
  Mail,
  Phone,
  Palette,
} from "lucide-react"
import { FaDiscord } from "react-icons/fa"
import type { FormData } from "@/components/form/types"

interface ConfirmationPageProps {
  formData: FormData
  formType: "reservation" | "verification"
}

export default function ConfirmationPage({ formData, formType }: ConfirmationPageProps) {
    const isReservation = formType === "reservation";
    const isVerification = formType === "verification";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }


  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="text-center">
      <motion.div variants={itemVariants} className="mb-8 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 w-100">
          <CheckCircle size={40} className="text-red-100" />
        </div>
        <h2 className="text-3xl font-bold text-red-100">Success!</h2>
        <p className="text-red-100/80 mt-2">Thanks {formData.first_name} for your submission.</p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-red-900/40 to-orange-800/40 rounded-xl p-6 border border-red-400/30 mb-8 backdrop-blur-sm"
      >
        <h3 className="text-xl font-semibold text-red-200 mb-4">Your Collector Info</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User size={20} className="text-red-300 mt-1" />
              <div>
                <h4 className="font-medium text-red-200">Personal Info</h4>
                <p className="text-red-100">
                  {formData.first_name} {formData.last_name}
                </p>
                <p className="text-red-100/70 text-sm">{formData.discord_username}</p>
                <p className="text-red-100/70 text-sm">{formData.instagram_handle}</p>
              </div>
            </div>

            {isVerification && (
              <div className="flex items-start gap-3">
                <FaDiscord size={20} className="text-red-300 mt-1" />
                <div>
                  <h4 className="font-medium text-red-200">Proof of Piece Submission</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {formData.proof_of_piece?.map((file, index) => (
                      <div key={index} className="bg-red-950/30 border border-red-400/20 rounded-lg p-4">
                        <img src={file} alt="Proof of Piece" className="w-full h-full object-cover rounded-lg border border-red-400/30" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {isReservation && (
              <div className="flex items-start gap-3">
                <Palette size={20} className="text-red-300 mt-1" />
                                  <div>
                    <h4 className="font-medium text-red-200">Design Preferences</h4>
                    <div className="space-y-1">
                      {formData.wall_piece_1 && (
                        <p className="text-red-100 text-sm">• {formData.wall_piece_1}</p>
                      )}
                      {formData.wall_piece_2 && (
                        <p className="text-red-100 text-sm">• {formData.wall_piece_2}</p>
                      )}
                      {formData.wall_piece_3 && (
                        <p className="text-red-100 text-sm">• {formData.wall_piece_3}</p>
                      )}
                      {formData.wall_piece_4 && (
                        <p className="text-red-100 text-sm">• {formData.wall_piece_4}</p>
                      )}
                      {formData.wall_piece_5 && (
                        <p className="text-red-100 text-sm">• {formData.wall_piece_5}</p>
                      )}
                    </div>
                </div>
              </div>
            )}
            

          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail size={20} className="text-red-300 mt-1" />
              <div>
                <h4 className="font-medium text-red-200">Contact Info</h4>
                <p className="text-red-100">{formData.email}</p>
                {formData.phone_number && <p className="text-red-100/70">{formData.phone_number}</p>}
              </div>
            </div>

          </div>
        </div>
      </motion.div>

      

      <motion.div variants={itemVariants}>
        {isReservation && (
          <>
          <p className="text-red-100/80 max-w-lg mx-auto">
            Your preferences have been saved and your spot on the waitlist is secured.
            A confirmation email is on its way, if it’s not in your inbox, please check your junk folder.
          </p>
          <p className="text-red-100/80">- PiggyBanx</p>
          </>
        )}
        {isVerification && (
          <p className="text-red-100/80">
            Please allow up to 1-2 weeks for your verification to be processed.
          </p>
        )}
      </motion.div>
    </motion.div>
  )
}
