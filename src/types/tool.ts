export type ToolCategory = 'content' | 'social' | 'analysis' | 'productivity' | 'other';

export interface ToolInput {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'file';
  placeholder?: string;
  required: boolean;
  options?: { value: string; label: string }[];
  defaultValue?: string | number;
  // For file input type
  accept?: string;
  maxSize?: number;
}

export interface ToolVariant {
  id: string;
  name: string;
  description: string;
  systemPromptPath: string;
  language?: string;
  icon?: string;
  customIconPath?: string;
  lucideIcon?: string;
}

export interface ToolSettings {
  maxTokens: number;
  temperature: number;
  topP?: number;
}

export interface ToolConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: ToolCategory;
  
  // Model configuration
  defaultModel: string;
  allowedModels?: string[];
  
  // Input configuration
  inputs: ToolInput[];
  
  // Variants (different system instructions)
  variants: ToolVariant[];
  
  // Generation settings
  settings: ToolSettings;
}
