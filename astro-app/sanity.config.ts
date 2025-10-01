import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './src/sanity/schemaTypes';

const projectId =
  import.meta.env.SANITY_STUDIO_PROJECT_ID ||
  import.meta.env.PUBLIC_SANITY_STUDIO_PROJECT_ID ||
  import.meta.env.PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.PUBLIC_SANITY_STUDIO_PROJECT_ID ||
  process.env.PUBLIC_SANITY_PROJECT_ID ||
  'your-projectID';

const dataset =
  import.meta.env.SANITY_STUDIO_DATASET ||
  import.meta.env.PUBLIC_SANITY_STUDIO_DATASET ||
  import.meta.env.PUBLIC_SANITY_DATASET ||
  process.env.SANITY_STUDIO_DATASET ||
  process.env.PUBLIC_SANITY_STUDIO_DATASET ||
  process.env.PUBLIC_SANITY_DATASET ||
  'production';

export default defineConfig({
  name: 'sanity-template-astro-clean',
  title: 'Sanity Astro Starter',
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
