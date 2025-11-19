import { Button } from "@/components/ui/button";
import { TransitionSelector } from "@/components/global/editor/TransitionSelector";
import { useSlideStore } from "@/store/useSlideStore";
import { Home, Play, Share2, StickyNote, Monitor, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";
import PresentationMode from "./PresentationMode";
import PresenterView from "./PresenterView";

type Props = {
  presentationId: string;
  onToggleNotes?: () => void;
};

const Navbar = ({ presentationId, onToggleNotes }: Props) => {
  const { currentTheme } = useSlideStore();
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [isPresenterView, setIsPresenterView] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/share/${presentationId}`
    );
    toast.success("Link  Copied", {
      description: "The link has been copied to your clipboard",
    });
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 w-full h-16 flex justify-between items-center py-2 px-6 border-b shadow-sm"
      style={{
        backgroundColor:
          currentTheme.navbarColor || currentTheme.backgroundColor,
        color: currentTheme.accentColor,
      }}
    >
      <div className="flex items-center gap-4">
        <Link href={"/dashboard"} passHref>
          <Button
            variant={"ghost"}
            size="sm"
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Button>
        </Link>
        <div className="h-6 w-px bg-border hidden sm:block" />
        <span className="text-sm font-medium hidden sm:block">
          Presentation Editor
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <TransitionSelector />
        <Button
          onClick={onToggleNotes}
          variant={"ghost"}
          size="sm"
          className="flex items-center gap-2"
        >
          <StickyNote className="w-4 h-4" />
          <span className="hidden sm:inline">Notes</span>
        </Button>
        <Button
          onClick={handleCopy}
          variant={"ghost"}
          size="sm"
          className="flex items-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Share</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={"default"}
              size="sm"
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              <span className="hidden sm:inline">Present</span>
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsPresentationMode(true)}>
              <Play className="w-4 h-4 mr-2" />
              Present (Full Screen)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsPresenterView(true)}>
              <Monitor className="w-4 h-4 mr-2" />
              Presenter View
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {isPresentationMode && (
        <PresentationMode onClose={() => setIsPresentationMode(false)} />
      )}
      {isPresenterView && (
        <PresenterView onClose={() => setIsPresenterView(false)} />
      )}
    </nav>
  );
};

export default Navbar;