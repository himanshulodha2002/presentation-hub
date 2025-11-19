import { useSlideStore } from "@/store/useSlideStore";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Play, Pause, RotateCcw } from "lucide-react";
import MasterRecursiveComponent from "../editor/MasterRecursiveComponent";

type Props = {
  onClose: () => void;
};

const PresenterView = ({ onClose }: Props) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const { getOrderedSlides, currentTheme } = useSlideStore();

  const slides = getOrderedSlides();
  const currentSlide = slides[currentSlideIndex];
  const nextSlide = slides[currentSlideIndex + 1];
  const transitionType = currentSlide?.transition?.type || "fade";
  const transitionDuration = (currentSlide?.transition?.duration || 500) / 1000;

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

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goToNextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        gotToPreviousSlide();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slides.length, currentSlideIndex]);

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-black flex z-50">
      {/* Main presentation area (left 2/3) */}
      <div className="w-2/3 h-full flex items-center justify-center p-8">
        <div
          className="relative w-full h-full"
          style={{
            aspectRatio: "16/9",
            maxHeight: "100%",
            maxWidth: "100%",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlideIndex}
              initial={transitionVariants.initial}
              animate={transitionVariants.animate}
              exit={transitionVariants.exit}
              transition={{ duration: transitionDuration, ease: "easeInOut" }}
              className="w-full h-full pointer-events-none"
              style={{
                backgroundColor: currentTheme.slideBackgroundColor,
                backgroundImage: currentTheme.gradientBackground,
                color: currentTheme.accentColor,
                fontFamily: currentTheme.fontFamily,
              }}
            >
              <MasterRecursiveComponent
                content={currentSlide.content}
                onContentChange={() => {}}
                slideId={currentSlide.id}
                isPreview={false}
                isEditable={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Presenter controls (right 1/3) */}
      <div className="w-1/3 h-full bg-gray-900 text-white p-6 flex flex-col">
        {/* Header with timer and controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-800"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
            >
              {isTimerRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-800"
              onClick={() => setTimer(0)}
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
            <div className="text-2xl font-mono font-bold">{formatTime(timer)}</div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-gray-800"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Slide counter */}
        <div className="text-center mb-6">
          <div className="text-4xl font-bold">
            {currentSlideIndex + 1} / {slides.length}
          </div>
          <div className="text-sm text-gray-400 mt-1">Current Slide</div>
        </div>

        {/* Next slide preview */}
        {nextSlide && (
          <div className="mb-6">
            <div className="text-sm text-gray-400 mb-2">Next Slide:</div>
            <div
              className="w-full aspect-video rounded border border-gray-700 overflow-hidden"
              style={{
                backgroundColor: currentTheme.slideBackgroundColor,
                backgroundImage: currentTheme.gradientBackground,
                color: currentTheme.accentColor,
                fontFamily: currentTheme.fontFamily,
                transform: "scale(0.8)",
                transformOrigin: "top left",
                width: "125%",
                height: "125%",
              }}
            >
              <div style={{ transform: "scale(0.8)", transformOrigin: "top left" }}>
                <MasterRecursiveComponent
                  content={nextSlide.content}
                  onContentChange={() => {}}
                  slideId={nextSlide.id}
                  isPreview={true}
                  isEditable={false}
                />
              </div>
            </div>
          </div>
        )}

        {/* Speaker notes */}
        <div className="flex-1 overflow-auto mb-6">
          <div className="text-sm text-gray-400 mb-2">Speaker Notes:</div>
          <div className="bg-gray-800 p-4 rounded text-sm">
            {currentSlide.notes || "No notes for this slide"}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            onClick={gotToPreviousSlide}
            disabled={currentSlideIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button
            variant="outline"
            className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            onClick={goToNextSlide}
          >
            {isLastSlide ? "End" : "Next"}
            {!isLastSlide && <ChevronRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PresenterView;
