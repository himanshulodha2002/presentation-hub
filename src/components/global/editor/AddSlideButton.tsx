"use client";

import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { LayoutSlides } from "@/lib/types";
import { useSlideStore } from "@/store/useSlideStore";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { v4 } from "uuid";
import { SlideTemplateSelector } from "./SlideTemplateSelector";

export function AddSlideButton() {
    const [showTemplateSelector, setShowTemplateSelector] = useState(false);
    const { addSlideAtIndex, slides } = useSlideStore();

    const handleTemplateSelect = (template: LayoutSlides) => {
        const newIndex = slides.length;
        addSlideAtIndex(
            { ...template, id: v4(), slideOrder: newIndex },
            newIndex
        );
    };

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="lg"
                            className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg z-50"
                            onClick={() => setShowTemplateSelector(true)}
                        >
                            <Plus className="h-6 w-6" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Add New Slide</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <SlideTemplateSelector
                open={showTemplateSelector}
                onOpenChange={setShowTemplateSelector}
                onSelectTemplate={handleTemplateSelect}
            />
        </>
    );
}
