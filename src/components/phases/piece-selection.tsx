"use client"

import type React from "react"

import { motion } from "motion/react"
import { Palette, Sparkles } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import type { FormData } from "@/components/form/types"

interface PieceSelectionProps {
    formData: FormData
    updateFormData: (data: Partial<FormData>) => void
}

export default function PieceSelection({ formData, updateFormData }: PieceSelectionProps) {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        updateFormData({ [name]: value });
    }

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        updateFormData({ [name]: value });
    }

    const handleDesignChange = (index: number, value: string) => {
        const fieldName = index === 0 ? 'wall_piece_1' : 
                         index === 1 ? 'wall_piece_2' : 
                         index === 2 ? 'wall_piece_3' :
                         index === 3 ? 'wall_piece_4' :
                         'wall_piece_5';
        updateFormData({ [fieldName]: value });
    }

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1,
            },
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: { duration: 0.3 },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    }

    const designs = [
        formData.wall_piece_1 || '',
        formData.wall_piece_2 || '',
        formData.wall_piece_3 || '',
        formData.wall_piece_4 || '',
        formData.wall_piece_5 || ''
    ];

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit">
            <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
                <Palette size={28} className="text-red-300" />
                <h2 className="text-2xl font-bold text-red-100">
                    What designs would you love to own?
                </h2>
            </motion.div>

            <motion.p variants={itemVariants} className="text-red-100/80 mb-6">
            This form allows you to submit up to 5 designs (please specify Original or any alternate label) that you would want to own as a 1000% wall-mounted artwork. 
            These are not guaranteed; this is a reservation queue only. 
            If your selection is chosen for release or becomes available, we'll contact you directly to move forward.
            </motion.p>

            <motion.div variants={itemVariants} className="space-y-6">
                <div className="space-y-4">
                    {[0, 1, 2, 3, 4].map((index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="space-y-2"
                        >
                            <Label htmlFor={`design-${index + 1}`} className="text-red-200 flex items-center gap-2">
                                <Sparkles size={16} className="text-red-300" />
                                Design {index + 1} {index === 0 ? "*" : "(optional)"}
                            </Label>
                            <Input
                                id={`design-${index + 1}`}
                                value={designs[index] || ''}
                                onChange={(e) => handleDesignChange(index, e.target.value)}
                                placeholder={`Describe your ${index === 0 ? 'most wanted' : `${index + 1}${index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'}`} design choice...`}
                                className="border-red-400/30 bg-red-950/40 text-red-100 placeholder:text-red-300/50 focus:border-red-400 focus:ring-red-400"
                                required={index === 0}
                            />
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    )
}