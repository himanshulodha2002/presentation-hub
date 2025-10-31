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
    const { currentSlide, currentTheme } = useSlideStore()
    const [notes, setNotes] = useState<string>("")

    useEffect(() => {
        // In a real implementation, this would load notes from the slide data
        // For now, we'll just clear it when the slide changes
        setNotes("")
    }, [currentSlide])

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
                        Notes for Slide {currentSlide + 1}
                    </Label>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
            <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Click to add notes for this slide..."
                className="min-h-[100px] resize-none"
            />
        </div>
    )
}
