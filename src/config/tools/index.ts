import { toolRegistry } from '@/lib/tools/registry';
import { storyCreatorTool } from './story-creator';
import { postCreatorTool } from './post-creator';
import { sceneCreatorTool } from './scene-creator';
import { quoteGeneratorTool } from './quote-generator';
import { reelsCreatorTool } from './reels-creator';
import { sceneMoodDescriberTool } from './scene-mood-describer';

// Register all tools
toolRegistry.register(storyCreatorTool);
toolRegistry.register(postCreatorTool);
toolRegistry.register(sceneCreatorTool);
toolRegistry.register(quoteGeneratorTool);
toolRegistry.register(reelsCreatorTool);
toolRegistry.register(sceneMoodDescriberTool);

// Export for convenience
export { 
  storyCreatorTool, 
  postCreatorTool, 
  sceneCreatorTool, 
  quoteGeneratorTool, 
  reelsCreatorTool,
  sceneMoodDescriberTool
};
export { toolRegistry };
