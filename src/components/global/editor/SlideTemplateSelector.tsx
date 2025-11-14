"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    AccentLeft,
    AccentRight,
    BlankCard,
    FourColumns,
    FourImageColumns,
    ImageAndText,
    TableLayout,
    TextAndImage,
    ThreeColumns,
    ThreeColumnsWithHeadings,
    ThreeImageColumns,
    TwoColumns,
    TwoColumnsWithHeadings,
    TwoImageColumns,
} from "@/lib/slideLayouts";
import { LayoutSlides } from "@/lib/types";
import React from "react";

interface SlideTemplateSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelectTemplate: (template: LayoutSlides) => void;
}

const templates = [
    { ...BlankCard, preview: "Blank Slide" },
    { ...AccentLeft, preview: "Image Left, Content Right" },
    { ...AccentRight, preview: "Content Left, Image Right" },
    { ...ImageAndText, preview: "Image with Text" },
    { ...TextAndImage, preview: "Text with Image" },
    { ...TwoColumns, preview: "Two Columns" },
    { ...TwoColumnsWithHeadings, preview: "Two Columns with Headings" },
    { ...ThreeColumns, preview: "Three Columns" },
    { ...ThreeColumnsWithHeadings, preview: "Three Columns with Headings" },
    { ...FourColumns, preview: "Four Columns" },
    { ...TwoImageColumns, preview: "Two Image Columns" },
    { ...ThreeImageColumns, preview: "Three Image Columns" },
    { ...FourImageColumns, preview: "Four Image Columns" },
    { ...TableLayout, preview: "Table Layout" },
];

export function SlideTemplateSelector({
    open,
    onOpenChange,
    onSelectTemplate,
}: SlideTemplateSelectorProps) {
    const handleSelectTemplate = (template: LayoutSlides) => {
        onSelectTemplate(template);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle>Choose a Slide Template</DialogTitle>
                    <DialogDescription>
                        Select from various professionally designed slide layouts
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[600px] pr-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {templates.map((template, index) => (
                            <Button
                                key={index}
                                variant="outline"
                                className="h-32 flex flex-col items-center justify-center gap-2 hover:bg-accent"
                                onClick={() => handleSelectTemplate(template as LayoutSlides)}
                            >
                                <div className="text-xs font-semibold text-center">
                                    {template.slideName}
                                </div>
                                <div className="text-[10px] text-muted-foreground text-center">
                                    {template.preview}
                                </div>
                            </Button>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
