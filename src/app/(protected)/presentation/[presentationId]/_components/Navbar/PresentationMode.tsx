import { useSlideStore } from "@/store/useSlideStore";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import MasterRecursiveComponent from "../editor/MasterRecursiveComponent";

type Props = {
  onClose: () => void;
};

const PresentationMode = ({ onClose }: Props) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const { getOrderedSlides, currentTheme } = useSlideStore();

  const slides = getOrderedSlides();
  const currentSlide = slides[currentSlideIndex];
  const transitionType = currentSlide?.transition?.type || "fade";
  const transitionDuration = (currentSlide?.transition?.duration || 500) / 1000; // Convert to seconds

  const gotToPreviousSlide = () => {
    setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
  };

  const isLastSlide = currentSlideIndex === slides.length - 1;

  const goToNextSlide = () => {
    if (currentSlideIndex === slides.length - 1) {
      onClose();
    } else {
      setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "") {
        if (currentSlideIndex === slides.length - 1) {
          onClose();
        } else {
          setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1));
        }
      } else if (e.key === "ArrowLeft") {
        setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slides.length, currentSlideIndex, onClose]);

  // Define transition variants based on transition type
  const getTransitionVariants = () => {
    switch (transitionType) {
      case "slide":
        return {
          initial: { x: "100%", opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: "-100%", opacity: 0 },
        };
      case "zoom":
        return {
          initial: { scale: 0, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 2, opacity: 0 },
        };
      case "split":
        return {
          initial: { scaleX: 0, opacity: 0 },
          animate: { scaleX: 1, opacity: 1 },
          exit: { scaleX: 0, opacity: 0 },
        };
      case "reveal":
        return {
          initial: { clipPath: "inset(0 100% 0 0)", opacity: 1 },
          animate: { clipPath: "inset(0 0% 0 0)", opacity: 1 },
          exit: { clipPath: "inset(0 0 0 100%)", opacity: 1 },
        };
      case "fade":
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };
    }
  };

  const transitionVariants = getTransitionVariants();

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div
        className="relative w-full h-full"
        style={{
          aspectRatio: "16/9",
          maxHeight: "100vh",
          maxWidth: "177.78vh",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlideIndex}
            initial={transitionVariants.initial}
            animate={transitionVariants.animate}
            exit={transitionVariants.exit}
            transition={{ duration: transitionDuration, ease: "easeInOut" }}
            className={`w-full h-full pointer-events-none ${slides[currentSlideIndex].className}`}
            style={{
              backgroundColor: currentTheme.slideBackgroundColor,
              backgroundImage: currentTheme.gradientBackground,
              color: currentTheme.accentColor,
              fontFamily: currentTheme.fontFamily,
            }}
          >
            <MasterRecursiveComponent
              content={slides[currentSlideIndex].content}
              onContentChange={() => { }}
              slideId={slides[currentSlideIndex].id}
              isPreview={false}
              isEditable={false}
            />
          </motion.div>
        </AnimatePresence>
        <Button
          variant={"ghost"}
          size={"icon"}
          className="absolute top-4 right-4 text-white"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
          <Button
            variant={"outline"}
            size={"icon"}
            onClick={gotToPreviousSlide}
            disabled={currentSlideIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {!isLastSlide && (
            <Button variant={"outline"} size={"icon"} onClick={goToNextSlide}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PresentationMode;