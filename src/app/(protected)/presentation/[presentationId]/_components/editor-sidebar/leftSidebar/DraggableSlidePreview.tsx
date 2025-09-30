import { Slide } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useSlideStore } from "@/store/useSlideStore";
import React, { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import ScaledPreview from "./ScaledPreview";
import { Button } from "@/components/ui/button";
import { Copy, MoreVertical, Plus, Trash } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
    slide: Slide;
    index: number;
    moveSlide: (dragIndex: number, hoverIndex: number) => void;
    onAddSlide?: (index: number) => void;
};

const DragabbleSlidePreview = ({ index, moveSlide, slide, onAddSlide }: Props) => {
    const { currentSlide, setCurrentSlide, duplicateSlide, removeSlide } = useSlideStore();
    const ref = useRef<HTMLDivElement>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const [{ isDragging }, drag] = useDrag({
        type: "SLIDE",
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: "SLIDE",
        // eslint-disable-next-line  @typescript-eslint/no-unused-vars
        hover(item: { index: number }, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) {
                return;
            }
            moveSlide(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    drag(drop(ref));

    const handleDuplicate = (e: React.MouseEvent) => {
        e.stopPropagation();
        duplicateSlide(slide.id);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        removeSlide(slide.id);
        setShowDeleteDialog(false);
    };

    const handleAddAfter = (e: React.MouseEvent) => {
        e.stopPropagation();
        onAddSlide?.(index + 1);
    };

    return (
        <>
            <div
                ref={ref}
                className={cn(
                    "relative cursor-pointer group",
                    index === currentSlide ? "before:bg-blue-500" : "before:bg-transparent",
                    isDragging ? "opacity-50" : "opacity-100"
                )}
                onClick={() => setCurrentSlide(index)}
            >
                <div className="pl-2 mb-4 relative">
                    <ScaledPreview
                        slide={slide}
                        isActive={index === currentSlide}
                        index={index}
                    />
                    
                    {/* Quick actions on hover */}
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Popover>
                            <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button size="icon" variant="secondary" className="h-6 w-6">
                                    <MoreVertical className="h-3 w-3" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-48 p-2" align="end">
                                <div className="flex flex-col gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="justify-start"
                                        onClick={handleDuplicate}
                                    >
                                        <Copy className="h-4 w-4 mr-2" />
                                        Duplicate
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="justify-start"
                                        onClick={handleAddAfter}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add After
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="justify-start text-red-500 hover:text-red-600"
                                        onClick={handleDelete}
                                    >
                                        <Trash className="h-4 w-4 mr-2" />
                                        Delete
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Slide {index + 1}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this slide from your presentation.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default DragabbleSlidePreview;