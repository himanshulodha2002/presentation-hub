"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useSlideStore } from "@/store/useSlideStore"
import { StickyNote, X } from "lucide-react"
import React, { useEffect, useState } from "react"

interface SlideNotesPanelProps {
    isVisible: boolean
    onClose: () => void
}

export const SlideNotesPanel: React.FC<SlideNotesPanelProps> = ({
    isVisible,
    onClose,
}) => {
    const { getCurrentSlideData, updateSlideNotes, currentTheme } = useSlideStore()
    const [notes, setNotes] = useState<string>("")
    const currentSlideData = getCurrentSlideData()

    useEffect(() => {
        // Load notes from the current slide
        if (currentSlideData) {
            setNotes(currentSlideData.notes || "")
        }
    }, [currentSlideData?.id])

    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newNotes = e.target.value
        setNotes(newNotes)
        if (currentSlideData) {
            updateSlideNotes(currentSlideData.id, newNotes)
        }
    }

    if (!isVisible) return null

    return (
        <div
            className="border-t p-4"
            style={{
                backgroundColor: currentTheme.backgroundColor,
                color: currentTheme.fontColor,
            }}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <StickyNote className="h-4 w-4" />
                    <Label className="text-sm font-medium">
                        Notes for Slide {(currentSlideData?.slideOrder ?? 0) + 1}
                    </Label>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
            <Textarea
                value={notes}
                onChange={handleNotesChange}
                placeholder="Click to add notes for this slide..."
                className="min-h-[100px] resize-none"
            />
        </div>
    )
}
