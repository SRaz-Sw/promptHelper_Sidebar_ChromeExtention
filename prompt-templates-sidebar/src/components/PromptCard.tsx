import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Edit, Trash2, GripVertical } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Prompt } from "@/types/prompt";
import { cn } from "@/lib/utils";
import { formatRelativeDate } from "@/lib/dateUtils";

interface PromptCardProps {
  prompt: Prompt;
  onEdit: (prompt: Prompt) => void;
  onDelete: (promptId: string) => void;
  onCopy: (content: string) => void;
  isDragging?: boolean;
}

export function PromptCard({
  prompt,
  onEdit,
  onDelete,
  onCopy,
  isDragging,
}: PromptCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleCopy = async () => {
    try {
      // Try Chrome extension clipboard API first
      if (typeof chrome !== "undefined" && chrome.action) {
        // Focus the document first to ensure clipboard access
        window.focus();
        await new Promise((resolve) => setTimeout(resolve, 100));
        await navigator.clipboard.writeText(prompt.content);
      } else {
        // Fallback for regular web context
        await navigator.clipboard.writeText(prompt.content);
      }
      onCopy(prompt.content);
    } catch (error) {
      // Fallback to legacy method if clipboard API fails
      try {
        const textArea = document.createElement("textarea");
        textArea.value = prompt.content;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        onCopy(prompt.content);
      } catch (fallbackError) {
        console.error("Failed to copy text:", fallbackError);
      }
    }
  };

  // Add right click/context menu handler
  const handleContextMenu = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await handleCopy();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="w-full"
      onContextMenu={handleContextMenu}
    >
      <Card
        className={cn(
          "w-full group cursor-pointer transition-all duration-200 hover:shadow-lg border-l-4 border-l-primary text-start",
          isDragging && "opacity-50 rotate-3 scale-105"
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-lg font-semibold line-clamp-1 flex-1">
              {prompt.title}
            </CardTitle>
            <div
              className="flex items-center gap-1 flex-shrink-0 order-last rtl:order-first"
              dir="ltr"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.15 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={handleCopy}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => onEdit(prompt)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  onClick={() => onDelete(prompt.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
            </div>
          </div>
          {prompt.tags.length > 0 && (
            <motion.div
              className="flex flex-wrap gap-1 mt-2 "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {prompt.tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs bg-primary/5 shadow-sm border-primary/10"
                >
                  {tag}
                </Badge>
              ))}
              {prompt.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{prompt.tags.length - 3} more
                </Badge>
              )}
            </motion.div>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-start text-muted-foreground line-clamp-2">
            {prompt.content}
          </p>
          <motion.div
            className="text-xs text-muted-foreground mt-3 pt-2 border-t"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Edited: {formatRelativeDate(prompt.updatedAt)}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
