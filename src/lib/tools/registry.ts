import type { ToolConfig } from '@/types/tool';

class ToolRegistry {
  private tools: Map<string, ToolConfig> = new Map();

  register(tool: ToolConfig): void {
    if (this.tools.has(tool.id)) {
      console.warn(`Tool with id "${tool.id}" is already registered. Overwriting.`);
    }
    this.tools.set(tool.id, tool);
  }

  getAll(): ToolConfig[] {
    return Array.from(this.tools.values());
  }

  getById(id: string): ToolConfig | undefined {
    return this.tools.get(id);
  }

  getByCategory(category: string): ToolConfig[] {
    return this.getAll().filter((tool) => tool.category === category);
  }

  exists(id: string): boolean {
    return this.tools.has(id);
  }
}

// Export singleton instance
export const toolRegistry = new ToolRegistry();
