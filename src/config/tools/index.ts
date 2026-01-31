import { toolRegistry } from '@/lib/tools/registry';
import { storyCreatorTool } from './story-creator';
import { socialMediaPostTool } from './social-media-post';
import { imagePromptTool } from './image-prompt';

// Register all tools
toolRegistry.register(storyCreatorTool);
toolRegistry.register(socialMediaPostTool);
toolRegistry.register(imagePromptTool);

// Export for convenience
export { storyCreatorTool, socialMediaPostTool, imagePromptTool };
export { toolRegistry };
