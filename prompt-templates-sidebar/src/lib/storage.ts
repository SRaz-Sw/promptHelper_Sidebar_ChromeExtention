import { Prompt } from "@/types/prompt";
import {
  restoreDateFromStorage,
  dateToISOString,
  getDateForFilename,
  createCurrentDate,
  getValidDate,
} from "./dateUtils";

const STORAGE_KEY = "prompt_templates";

export const storageUtils = {
  async savePrompts(prompts: Prompt[]): Promise<void> {
    try {
      // Serialize dates to ISO strings to prevent Chrome storage corruption
      const serializedPrompts = prompts.map((prompt) => ({
        ...prompt,
        createdAt: dateToISOString(prompt.createdAt),
        updatedAt: dateToISOString(prompt.updatedAt),
      }));

      if (typeof chrome !== "undefined" && chrome.storage) {
        await chrome.storage.local.set({
          [STORAGE_KEY]: serializedPrompts,
        });
      } else {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(serializedPrompts)
        );
      }
    } catch (error) {
      console.error("Error saving prompts:", error);
      // Fallback to localStorage with serialized dates
      const serializedPrompts = prompts.map((prompt) => ({
        ...prompt,
        createdAt: dateToISOString(prompt.createdAt),
        updatedAt: dateToISOString(prompt.updatedAt),
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializedPrompts));
    }
  },

  async getPrompts(): Promise<Prompt[]> {
    try {
      let rawPrompts: any[] = [];

      if (typeof chrome !== "undefined" && chrome.storage) {
        const result = await chrome.storage.local.get(STORAGE_KEY);
        rawPrompts = result[STORAGE_KEY] || [];
      } else {
        const stored = localStorage.getItem(STORAGE_KEY);
        rawPrompts = stored ? JSON.parse(stored) : [];
      }

      // Ensure dates are properly converted using dateUtils
      return rawPrompts.map((prompt) => ({
        ...prompt,
        createdAt: restoreDateFromStorage(prompt.createdAt),
        updatedAt: restoreDateFromStorage(prompt.updatedAt),
      }));
    } catch (error) {
      console.error(
        "Error loading prompts, falling back to localStorage:",
        error
      );
      const stored = localStorage.getItem(STORAGE_KEY);
      const rawPrompts = stored ? JSON.parse(stored) : [];

      // Ensure dates are properly converted even in fallback
      return rawPrompts.map((prompt: any) => ({
        ...prompt,
        createdAt: restoreDateFromStorage(prompt.createdAt),
        updatedAt: restoreDateFromStorage(prompt.updatedAt),
      }));
    }
  },

  async addPrompt(prompt: Prompt): Promise<void> {
    const prompts = await this.getPrompts();
    prompts.push(prompt);
    await this.savePrompts(prompts);
  },

  async updatePrompt(updatedPrompt: Prompt): Promise<void> {
    const prompts = await this.getPrompts();
    const index = prompts.findIndex((p) => p.id === updatedPrompt.id);
    if (index !== -1) {
      prompts[index] = updatedPrompt;
      await this.savePrompts(prompts);
    }
  },

  async deletePrompt(promptId: string): Promise<void> {
    const prompts = await this.getPrompts();
    const filtered = prompts.filter((p) => p.id !== promptId);
    await this.savePrompts(filtered);
  },

  async reorderPrompts(reorderedPrompts: Prompt[]): Promise<void> {
    const promptsWithOrder = reorderedPrompts.map((prompt, index) => ({
      ...prompt,
      order: index,
    }));
    await this.savePrompts(promptsWithOrder);
  },

  // Export prompts to JSON file
  async exportPrompts(): Promise<void> {
    try {
      const prompts = await this.getPrompts();
      const exportData = {
        prompts,
        exportDate: dateToISOString(createCurrentDate()),
        version: "1.0",
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(dataBlob);
      link.download = `prompt-helper-backup-${getDateForFilename()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error exporting prompts:", error);
      throw new Error("Failed to export prompts");
    }
  },

  // Import prompts from JSON file
  async importPrompts(
    file: File
  ): Promise<{ success: boolean; imported: number; message: string }> {
    try {
      const text = await file.text();
      const importData = JSON.parse(text);

      // Validate import data structure
      if (!importData.prompts || !Array.isArray(importData.prompts)) {
        throw new Error("Invalid file format: missing prompts array");
      }

      const existingPrompts = await this.getPrompts();
      let importedCount = 0;

      // Process imported prompts
      const newPrompts = importData.prompts.filter((prompt: any) => {
        // Basic validation
        if (!prompt.id || !prompt.title || !prompt.content) {
          return false;
        }

        // Check for duplicates based on title and content
        const isDuplicate = existingPrompts.some(
          (existing) =>
            existing.title === prompt.title &&
            existing.content === prompt.content
        );

        if (!isDuplicate) {
          importedCount++;
          return true;
        }
        return false;
      });

      if (newPrompts.length > 0) {
        // Assign new order values
        const maxOrder =
          existingPrompts.length > 0
            ? Math.max(...existingPrompts.map((p) => p.order))
            : -1;
        const promptsToAdd = newPrompts.map(
          (prompt: any, index: number) => {
            // Use dateUtils for robust date handling
            const now = createCurrentDate();

            return {
              ...prompt,
              id: prompt.id || `imported-${Date.now()}-${index}`,
              order: maxOrder + 1 + index,
              createdAt: getValidDate(prompt.createdAt) || now,
              updatedAt: getValidDate(prompt.updatedAt) || now,
              tags: Array.isArray(prompt.tags) ? prompt.tags : [],
            };
          }
        );

        const allPrompts = [...existingPrompts, ...promptsToAdd];
        await this.savePrompts(allPrompts);
      }

      return {
        success: true,
        imported: importedCount,
        message:
          importedCount > 0
            ? `Successfully imported ${importedCount} prompt${
                importedCount > 1 ? "s" : ""
              }`
            : "No new prompts to import (duplicates were skipped)",
      };
    } catch (error) {
      console.error("Error importing prompts:", error);
      return {
        success: false,
        imported: 0,
        message:
          error instanceof Error
            ? error.message
            : "Failed to import prompts",
      };
    }
  },
};
