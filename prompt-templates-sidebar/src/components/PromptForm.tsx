import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Save, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Prompt, PromptFormData } from "@/types/prompt";

interface PromptFormProps {
  onSubmit: (data: PromptFormData) => void;
  onCancel: () => void;
  existingPrompt?: Prompt;
  isOpen: boolean;
}

export function PromptForm({
  onSubmit,
  onCancel,
  existingPrompt,
  isOpen,
}: PromptFormProps) {
  const { t } = useTranslation();

  // Create validation schema with translated messages
  const promptSchema = z.object({
    title: z
      .string()
      .min(1, t("validation.titleRequired"))
      .max(100, t("validation.titleMaxLength", { max: 100 })),
    content: z
      .string()
      .min(1, t("validation.contentRequired"))
      .max(2000, t("validation.contentMaxLength", { max: 2000 })),
    tags: z.string().max(200, t("validation.tagsMaxLength", { max: 200 })),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PromptFormData>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: "",
    },
  });

  // Reset form with existing prompt data when it opens or existingPrompt changes
  useEffect(() => {
    if (isOpen) {
      reset({
        title: existingPrompt?.title || "",
        content: existingPrompt?.content || "",
        tags: existingPrompt?.tags.join(", ") || "",
      });
    }
  }, [existingPrompt, isOpen, reset]);

  const handleFormSubmit = (data: PromptFormData) => {
    onSubmit(data);
    reset({
      title: "",
      content: "",
      tags: "",
    });
  };

  const handleCancel = () => {
    reset({
      title: "",
      content: "",
      tags: "",
    });
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {existingPrompt ? t("form.editPrompt") : t("form.newPrompt")}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handleCancel}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="title">{t("form.title.label")}</Label>
                <Input
                  id="title"
                  placeholder={t("form.title.placeholder")}
                  {...register("title")}
                />
                {errors.title && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive"
                  >
                    {errors.title.message}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">{t("form.content.label")}</Label>
                <Textarea
                  id="content"
                  placeholder={t("form.content.placeholder")}
                  rows={6}
                  {...register("content")}
                />
                {errors.content && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive"
                  >
                    {errors.content.message}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">{t("form.tags.label")}</Label>
                <Input
                  id="tags"
                  placeholder={t("form.tags.placeholder")}
                  {...register("tags")}
                />
                <p className="text-xs text-muted-foreground">
                  {t("form.tags.help")}
                </p>
                {errors.tags && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive"
                  >
                    {errors.tags.message}
                  </motion.p>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting
                    ? t("buttons.saving")
                    : existingPrompt
                    ? t("buttons.update")
                    : t("buttons.save")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  {t("buttons.cancel")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
