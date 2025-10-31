import { updateSlides } from "@/actions/project"
import { SlideTemplateSelector } from "@/components/global/editor/SlideTemplateSelector"
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
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { LayoutSlides, Slide } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useSlideStore } from "@/store/useSlideStore"
import { Copy, EllipsisVertical, Plus, Trash } from "lucide-react"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useDrag, useDrop } from "react-dnd"
import { v4 } from "uuid"
import MasterRecursiveComponent from "./MasterRecursiveComponent"

type EditorProps = {
    isEditable: boolean
}

interface DropZoneProps {
    index: number
    isEditable: boolean
    onDrop: (
        item: {
            type: string
            layoutType: string
            component: LayoutSlides
            index?: number
        },
        dropIndex: number
    ) => void
}

// Component that handles drop functionality
const DropZoneContent: React.FC<DropZoneProps> = ({
    index,
    onDrop,
}) => {
    const [{ isOver, canDrop }, dropref] = useDrop({
        accept: ["SLIDE", "LAYOUT"],
        drop: (item: {
            type: string
            layoutType: string
            component: LayoutSlides
            index?: number
        }) => onDrop(item, index),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        }),
    })

    return (
        <div
            ref={dropref as unknown as React.LegacyRef<HTMLDivElement>}
            className={cn(
                "h-3 transition-all duration-200",
                isOver && canDrop && "bg-blue-500 h-6"
            )}
        ></div>
    )
}

// Wrapper component that conditionally renders the drop zone
export const DropZone: React.FC<DropZoneProps> = (props) => {
    if (!props.isEditable) return null
    
    try {
        return <DropZoneContent {...props} />
    } catch {
        return null
    }
}

interface DragableSlideProps {
    index: number
    slide: Slide
    isEditable: boolean
    moveSlide: (dragIndex: number, hoverIndex: number) => void
    handleDelete: (id: string) => void
    handleDuplicate: (id: string) => void
    handleAddSlide: (index: number) => void
}

// Component that handles drag functionality
const DragableSlideContent: React.FC<DragableSlideProps> = ({
    index,
    slide,
    isEditable,
    moveSlide,
    handleDelete,
    handleDuplicate,
    handleAddSlide,
}) => {
    const slideRef = useRef<HTMLDivElement>(null)
    const { currentSlide, currentTheme, setCurrentSlide, updateContentItem } =
        useSlideStore()
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
        
    const [{ isDragging }, drag] = useDrag({
        type: "SLIDE",
        item: { index, type: "slide" },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    })

    const [, drop] = useDrop({
        accept: "SLIDE",
        hover(item: { index: number; type: string }) {
            if (!slideRef.current) {
                return
            }
            const dragIndex = item.index
            const hoverIndex = index
            if (dragIndex === hoverIndex) {
                return
            }
            moveSlide(dragIndex, hoverIndex)
            item.index = hoverIndex
        },
    })

    drag(drop(slideRef))

    const handelContentChange = (
        contentID: string,
        newContent: string | string[] | string[][]
    ) => {
        if (isEditable) {
            updateContentItem(slide.id, contentID, newContent)
        }
    }

    const confirmDelete = () => {
        handleDelete(slide.id)
        setShowDeleteDialog(false)
    }

    return (
        <>
            <div
                ref={slideRef}
                className={cn(
                    "w-full rounded-lg shadow-lg relative p-0 min-h-[400px] max-h-[800px]",
                    "shadow-xl transition-shadow duration-300",
                    "flex flex-col",
                    index === currentSlide
                        ? "ring-2 ring-blue-500 ring-offset-2"
                        : "",
                    slide.className,
                    isDragging ? "opacity-50" : "opacity-100"
                )}
                style={{ backgroundImage: currentTheme.gradientBackground }}
                onClick={() => setCurrentSlide(index)}
            >
                <div className="size-full flex-grow overflow-hidden">
                    <MasterRecursiveComponent
                        content={slide.content}
                        isEditable={isEditable}
                        isPreview={false}
                        slideId={slide.id}
                        onContentChange={handelContentChange}
                    />
                </div>
                {isEditable && (
                    <Popover>
                        <PopoverTrigger asChild className="absolute top-2 left-2">
                            <Button size={"sm"} variant={"outline"}>
                                <EllipsisVertical className="size-5" />
                                <span className="sr-only">Slide Options</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-fit p-2">
                            <div className="flex flex-col gap-1">
                                <Button
                                    variant={"ghost"}
                                    className="justify-start"
                                    onClick={() => handleDuplicate(slide.id)}
                                >
                                    <Copy className="size-4 mr-2" />
                                    Duplicate Slide
                                </Button>
                                <Button
                                    variant={"ghost"}
                                    className="justify-start"
                                    onClick={() => handleAddSlide(index + 1)}
                                >
                                    <Plus className="size-4 mr-2" />
                                    Add Slide After
                                </Button>
                                <Button
                                    variant={"ghost"}
                                    className="justify-start text-red-500 hover:text-red-600"
                                    onClick={() => setShowDeleteDialog(true)}
                                >
                                    <Trash className="size-4 mr-2" />
                                    Delete Slide
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                )}
            </div>
            
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Slide?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this slide from your presentation.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

// Wrapper component that conditionally renders the dragable slide
export const DragableSlide: React.FC<DragableSlideProps> = (props) => {
    try {
        return <DragableSlideContent {...props} />
    } catch {
        return null
    }
}

const Editor = ({ isEditable }: EditorProps) => {
    const slideRefs = useRef<(HTMLDivElement | null)[]>([])
    const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)
    const [isLoading, setLoading] = useState(true)
    const [showTemplateSelector, setShowTemplateSelector] = useState(false)
    const [insertIndex, setInsertIndex] = useState<number>(0)
    const {
        currentSlide,
        slides,
        project,
        getOrderedSlides,
        reorderSlides,
        addSlideAtIndex,
        removeSlide,
        duplicateSlide,
    } = useSlideStore()
    const orderedSlides = getOrderedSlides()

    const moveSlide = (dragIndex: number, hoverIndex: number) => {
        if (isEditable) {
            reorderSlides(dragIndex, hoverIndex)
        }
    }

    const handleDrop = (
        item: {
            type: string
            layoutType: string
            component: LayoutSlides
            index?: number
        },
        dropIndex: number
    ) => {
        if (!isEditable) {
            return
        }

        if (item.type === "layout") {
            addSlideAtIndex(
                { ...item.component, id: v4(), slideOrder: dropIndex },
                dropIndex
            )
        } else if (item.type === "slide" && item.index !== undefined) {
            moveSlide(item.index, dropIndex)
        }
    }

    const handleDelete = (id: string) => {
        if (isEditable) {
            removeSlide(id)
        }
    }

    const handleDuplicate = (id: string) => {
        if (isEditable) {
            duplicateSlide(id)
        }
    }

    const handleAddSlide = (index: number) => {
        if (isEditable) {
            setInsertIndex(index)
            setShowTemplateSelector(true)
        }
    }

    const handleTemplateSelect = (template: LayoutSlides) => {
        addSlideAtIndex(
            { ...template, id: v4(), slideOrder: insertIndex },
            insertIndex
        )
    }

    useEffect(() => {
        if (slideRefs.current[currentSlide]) {
            slideRefs.current[currentSlide]?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            })
        }
    }, [currentSlide])

    useEffect(() => {
        if (typeof window !== "undefined") {
            setLoading(false)
        }
    }, [])

    const saveSlides = useCallback(() => {
        if (isEditable && project) {
            ;(async () => {
                await updateSlides(
                    project.id,
                    JSON.parse(JSON.stringify(slides))
                )
            })()
        }
    }, [slides, project, isEditable])

    useEffect(() => {
        if (autoSaveTimerRef.current) {
            clearTimeout(autoSaveTimerRef.current)
        }

        if (isEditable) {
            autoSaveTimerRef.current = setTimeout(() => {
                saveSlides()
            }, 2000)
        }

        return () => {
            if (autoSaveTimerRef.current) {
                clearTimeout(autoSaveTimerRef.current)
            }
        }
    }, [slides, isEditable, project, saveSlides])

    return (
        <div className="flex-1 flex flex-col h-full max-w-3xl mx-auto px-4 mb-20">
            {isLoading ? (
                <div className="w-full px-4 flex flex-col space-y-2 mt-8">
                    <Skeleton className="h-52 w-full" />
                    <Skeleton className="h-52 w-full" />
                    <Skeleton className="h-52 w-full" />
                </div>
            ) : (
                <>
                    <ScrollArea className="flex-1 mt-8">
                        <div className="px-4 pb-4 space-y-4 pt-2">
                            {isEditable && (
                                <DropZone
                                    index={0}
                                    isEditable={isEditable}
                                    onDrop={handleDrop}
                                />
                            )}
                            {orderedSlides.map((slide, index) => (
                                <React.Fragment key={slide.id || index}>
                                    <DragableSlide
                                        slide={slide}
                                        index={index}
                                        isEditable={isEditable}
                                        moveSlide={moveSlide}
                                        handleDelete={handleDelete}
                                        handleDuplicate={handleDuplicate}
                                        handleAddSlide={handleAddSlide}
                                    />
                                    {isEditable && (
                                        <DropZone
                                            index={index + 1}
                                            isEditable={isEditable}
                                            onDrop={handleDrop}
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </ScrollArea>
                    
                    <SlideTemplateSelector
                        open={showTemplateSelector}
                        onOpenChange={setShowTemplateSelector}
                        onSelectTemplate={handleTemplateSelect}
                    />
                </>
            )}
        </div>
    )
}

export default Editor