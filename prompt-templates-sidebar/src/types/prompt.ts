export interface Prompt {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  order: number;
}

export interface PromptFormData {
  title: string;
  content: string;
  tags: string;
}