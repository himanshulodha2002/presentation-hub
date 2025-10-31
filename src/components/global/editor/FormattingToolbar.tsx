"use client"

import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useSlideStore } from "@/store/useSlideStore"
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Italic,
    List,
    ListOrdered,
    Redo,
    Underline,
    Undo,
} from "lucide-react"
import React from "react"

interface FormattingToolbarProps {
    onFormatChange?: (format: string, value: string | boolean) => void
}

export const FormattingToolbar: React.FC<FormattingToolbarProps> = ({
    onFormatChange,
}) => {
    const { currentTheme } = useSlideStore()
    const [fontSize, setFontSize] = React.useState("16")
    const [fontFamily, setFontFamily] = React.useState("Inter")

    const fontSizes = ["8", "10", "12", "14", "16", "18", "20", "24", "28", "32", "36", "48", "64", "72"]
    const fontFamilies = ["Inter", "Arial", "Times New Roman", "Georgia", "Courier New", "Comic Sans MS", "Roboto", "Open Sans"]

    const handleFontSizeChange = (value: string) => {
        setFontSize(value)
        onFormatChange?.("fontSize", value)
    }

    const handleFontFamilyChange = (value: string) => {
        setFontFamily(value)
        onFormatChange?.("fontFamily", value)
    }

    const handleFormatClick = (format: string) => {
        onFormatChange?.(format, true)
    }

    return (
        <TooltipProvider>
            <div
                className="flex items-center gap-2 p-2 border-b"
                style={{
                    backgroundColor: currentTheme.navbarColor || currentTheme.backgroundColor,
                    color: currentTheme.accentColor,
                }}
            >
                {/* Font Family */}
                <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
                    <SelectTrigger className="w-[140px] h-8">
                        <SelectValue placeholder="Font" />
                    </SelectTrigger>
                    <SelectContent>
                        {fontFamilies.map((font) => (
                            <SelectItem key={font} value={font}>
                                <span style={{ fontFamily: font }}>{font}</span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Font Size */}
                <Select value={fontSize} onValueChange={handleFontSizeChange}>
                    <SelectTrigger className="w-[70px] h-8">
                        <SelectValue placeholder="Size" />
                    </SelectTrigger>
                    <SelectContent>
                        {fontSizes.map((size) => (
                            <SelectItem key={size} value={size}>
                                {size}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Separator orientation="vertical" className="h-6" />

                {/* Undo/Redo */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleFormatClick("undo")}
                        >
                            <Undo className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleFormatClick("redo")}
                        >
                            <Redo className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
                </Tooltip>

                <Separator orientation="vertical" className="h-6" />

                {/* Text Formatting */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleFormatClick("bold")}
                        >
                            <Bold className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Bold (Ctrl+B)</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleFormatClick("italic")}
                        >
                            <Italic className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Italic (Ctrl+I)</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleFormatClick("underline")}
                        >
                            <Underline className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Underline (Ctrl+U)</TooltipContent>
                </Tooltip>

                <Separator orientation="vertical" className="h-6" />

                {/* Alignment */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleFormatClick("alignLeft")}
                        >
                            <AlignLeft className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Align Left (Ctrl+L)</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleFormatClick("alignCenter")}
                        >
                            <AlignCenter className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Align Center (Ctrl+E)</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleFormatClick("alignRight")}
                        >
                            <AlignRight className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Align Right (Ctrl+R)</TooltipContent>
                </Tooltip>

                <Separator orientation="vertical" className="h-6" />

                {/* Lists */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleFormatClick("bulletList")}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Bullet List</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleFormatClick("numberedList")}
                        >
                            <ListOrdered className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Numbered List</TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    )
}
