"use client"

import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useSlideStore } from "@/store/useSlideStore"
import {
    Image,
    Shapes,
    Table,
    Type,
    Upload,
} from "lucide-react"
import React, { useRef } from "react"
import { toast } from "sonner"

export const QuickAccessToolbar: React.FC = () => {
    const { currentTheme } = useSlideStore()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleInsertText = () => {
        document.execCommand('insertHTML', false, '<p>New text box</p>')
        toast.success("Text box inserted")
    }

    const handleInsertImage = () => {
        const url = prompt('Enter image URL:')
        if (url) {
            document.execCommand('insertHTML', false, `<img src="${url}" alt="Inserted image" style="max-width: 100%; height: auto; margin: 10px 0;" />`)
            toast.success("Image inserted")
        }
    }

    const handleUploadImage = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error("Please select an image file")
                return
            }

            const reader = new FileReader()
            reader.onload = (event) => {
                const base64 = event.target?.result as string
                document.execCommand('insertHTML', false, `<img src="${base64}" alt="Uploaded image" style="max-width: 100%; height: auto; margin: 10px 0;" />`)
                toast.success("Image uploaded and inserted")
            }
            reader.readAsDataURL(file)
        }
        // Reset input so same file can be selected again
        e.target.value = ''
    }

    const handleInsertShape = () => {
        const shapes = ['Rectangle', 'Circle', 'Arrow Right', 'Line', 'Triangle']
        const choice = prompt(`Choose a shape:\n1. Rectangle\n2. Circle\n3. Arrow Right\n4. Line\n5. Triangle\n\nEnter number (1-5):`)

        if (!choice) return

        let shapeHTML = ''
        const shapeNumber = parseInt(choice)

        switch (shapeNumber) {
            case 1: // Rectangle
                shapeHTML = '<div style="width: 150px; height: 100px; background-color: #3b82f6; display: inline-block; margin: 10px; border-radius: 4px;"></div>'
                break
            case 2: // Circle
                shapeHTML = '<div style="width: 100px; height: 100px; background-color: #10b981; display: inline-block; margin: 10px; border-radius: 50%;"></div>'
                break
            case 3: // Arrow Right
                shapeHTML = '<div style="width: 0; height: 0; border-top: 25px solid transparent; border-bottom: 25px solid transparent; border-left: 50px solid #f59e0b; display: inline-block; margin: 10px;"></div>'
                break
            case 4: // Line
                shapeHTML = '<hr style="width: 200px; height: 3px; background-color: #6366f1; border: none; margin: 10px; display: inline-block;" />'
                break
            case 5: // Triangle
                shapeHTML = '<div style="width: 0; height: 0; border-left: 50px solid transparent; border-right: 50px solid transparent; border-bottom: 87px solid #ef4444; display: inline-block; margin: 10px;"></div>'
                break
            default:
                toast.error("Invalid choice")
                return
        }

        document.execCommand('insertHTML', false, shapeHTML)
        toast.success(`${shapes[shapeNumber - 1]} inserted`)
    }

    const handleInsertTable = () => {
        const rows = prompt('Number of rows:', '3')
        const cols = prompt('Number of columns:', '3')
        if (rows && cols) {
            let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%; margin: 10px 0;"><tbody>'
            for (let i = 0; i < parseInt(rows); i++) {
                tableHTML += '<tr>'
                for (let j = 0; j < parseInt(cols); j++) {
                    tableHTML += '<td style="border: 1px solid #ccc; padding: 8px;">Cell</td>'
                }
                tableHTML += '</tr>'
            }
            tableHTML += '</tbody></table>'
            document.execCommand('insertHTML', false, tableHTML)
            toast.success("Table inserted")
        }
    }

    return (
        <TooltipProvider>
            <div
                className="fixed top-28 left-0 right-0 z-40 flex items-center gap-1 px-3 py-2 border-b"
                style={{
                    backgroundColor: currentTheme.backgroundColor,
                    color: currentTheme.accentColor,
                }}
            >
                <span className="text-xs font-medium mr-2">Quick Insert:</span>
                
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={handleInsertText}
                        >
                            <Type className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Insert Text Box</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={handleInsertImage}
                        >
                            <Image className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Insert Image from URL</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={handleUploadImage}
                        >
                            <Upload className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Upload Image</TooltipContent>
                </Tooltip>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={handleInsertShape}
                        >
                            <Shapes className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Insert Shape</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={handleInsertTable}
                        >
                            <Table className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Insert Table</TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    )
}
