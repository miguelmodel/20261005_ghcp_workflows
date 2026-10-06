import { defineConfig } from 'vite';

// Local-first: development and review always use base "/".
// Publishing (orchestrator-owned) passes --base=/<repo-name>/ on the command line.
export default defineConfig({
  base: '/',
  server: {
    strictPort: false,
    open: false
  },
  preview: {
    strictPort: false
  }
});
