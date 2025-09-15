import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Download, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PromptForm } from "./PromptForm";
import { DragDropPromptList } from "./DragDropContext";
import { DarkModeToggle } from "./DarkModeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Prompt, PromptFormData } from "@/types/prompt";
import { storageUtils } from "@/lib/storage";
import { v4 as uuidv4 } from "uuid";
import { createCurrentDate } from "@/lib/dateUtils";

export function PromptSidebar() {
  const { t } = useTranslation();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | undefined>();
  const [copiedMessage, setCopiedMessage] = useState("");
  const [importExportMessage, setImportExportMessage] = useState("");

  useEffect(() => {
    loadPrompts();
  }, []);

  useEffect(() => {
    let filtered = prompts;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (prompt) =>
          prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prompt.content
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          prompt.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Filter by selected tag
    if (selectedTag) {
      filtered = filtered.filter((prompt) =>
        prompt.tags.some(
          (tag) => tag.toLowerCase() === selectedTag.toLowerCase()
        )
      );
    }

    setFilteredPrompts(filtered);
  }, [prompts, searchQuery, selectedTag]);

  const loadPrompts = async () => {
    const loadedPrompts = await storageUtils.getPrompts();
    const sortedPrompts = loadedPrompts.sort((a, b) => a.order - b.order);
    setPrompts(sortedPrompts);
  };

  const handleSubmit = async (data: PromptFormData) => {
    const tags = data.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    if (editingPrompt) {
      const updatedPrompt: Prompt = {
        ...editingPrompt,
        title: data.title,
        content: data.content,
        tags,
        updatedAt: createCurrentDate(),
      };
      await storageUtils.updatePrompt(updatedPrompt);
      setPrompts((prev) =>
        prev.map((p) => (p.id === updatedPrompt.id ? updatedPrompt : p))
      );
    } else {
      const newPrompt: Prompt = {
        id: uuidv4(),
        title: data.title,
        content: data.content,
        tags,
        createdAt: createCurrentDate(),
        updatedAt: createCurrentDate(),
        order: prompts.length,
      };
      await storageUtils.addPrompt(newPrompt);
      setPrompts((prev) => [...prev, newPrompt]);
    }

    setIsFormOpen(false);
    setEditingPrompt(undefined);
  };

  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setIsFormOpen(true);
  };

  const handleDelete = async (promptId: string) => {
    await storageUtils.deletePrompt(promptId);
    setPrompts((prev) => prev.filter((p) => p.id !== promptId));
  };

  const handleReorder = async (reorderedPrompts: Prompt[]) => {
    setPrompts(reorderedPrompts);
    await storageUtils.reorderPrompts(reorderedPrompts);
  };

  const handleCopy = () => {
    setCopiedMessage(t("messages.copied"));
    setTimeout(() => setCopiedMessage(""), 2000);
  };

  const handleNewPrompt = () => {
    setEditingPrompt(undefined);
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingPrompt(undefined);
  };

  // Get all unique tags from prompts
  const getAllTags = () => {
    const allTags = prompts.flatMap((prompt) => prompt.tags);
    return Array.from(new Set(allTags)).sort();
  };

  // Export prompts to JSON file
  const handleExport = async () => {
    try {
      await storageUtils.exportPrompts();
      setImportExportMessage(t("messages.exportSuccess"));
      setTimeout(() => setImportExportMessage(""), 3000);
    } catch (error) {
      setImportExportMessage(t("messages.exportError"));
      setTimeout(() => setImportExportMessage(""), 3000);
    }
  };

  // Import prompts from JSON file
  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const result = await storageUtils.importPrompts(file);
        setImportExportMessage(
          result.success
            ? t("messages.importSuccess", { count: result.imported })
            : t("messages.importError")
        );
        setTimeout(() => setImportExportMessage(""), 4000);

        if (result.success && result.imported > 0) {
          // Reload prompts to show imported ones
          await loadPrompts();
        }
      }
    };
    input.click();
  };

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Custom Header to visually replace Chrome's header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-3 pt-1 pb-3 bg-gradient-to-r from-primary/5 to-primary/10"
      >
        <div className="flex items-center gap-2 mb-4">
          {/* <div className="p-2 bg-primary/10 rounded-lg">
            <Sparkles className="h-5 w-5 text-primary" />
          </div> */}
          <LanguageSwitcher />
          <div className="flex-1">
            <h1 className="text-lg font-semibold">{t("sidebar.title")}</h1>
            <p className="text-xs text-muted-foreground">
              {t("sidebar.promptsCount", { count: prompts.length })}{" "}
              {t("sidebar.promptsSaved")}
            </p>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleExport}
              title={t("buttons.export")}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleImport}
              title={t("buttons.import")}
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2 min-w-[90%] mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("search.placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={handleNewPrompt} className="w-full" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            {t("buttons.newPrompt")}
          </Button>
        </div>
      </motion.div>

      {/* Tag Filter */}
      {getAllTags().length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-3 py-2"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-muted-foreground"></span>
            {selectedTag && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => setSelectedTag("")}
              >
                {t("search.clear")}
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto w-[90%] mx-auto">
            {getAllTags().map((tag) => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? "default" : "secondary"}
                className="cursor-pointer text-xs hover:bg-primary/80 transition-colors"
                onClick={() =>
                  setSelectedTag(selectedTag === tag ? "" : tag)
                }
              >
                {tag}
              </Badge>
            ))}
          </div>
        </motion.div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className="px-3 py-2 h-full overflow-y-auto">
          <DragDropPromptList
            prompts={filteredPrompts}
            onReorder={handleReorder}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCopy={handleCopy}
          />
        </div>
      </div>

      {/* Notifications */}
      <AnimatePresence>
        {copiedMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg z-50"
          >
            {copiedMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {importExportMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-card text-foreground px-4 py-2 rounded-lg shadow-lg border z-50"
          >
            {importExportMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dark Mode Toggle - positioned at bottom */}
      <DarkModeToggle />

      {/* Form */}
      <PromptForm
        isOpen={isFormOpen}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        existingPrompt={editingPrompt}
      />
    </div>
  );
}
