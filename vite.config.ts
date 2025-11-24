import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Fix: explicitly cast process to any to avoid TS errors with cwd()
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    },
    // CRITICAL: This must match your GitHub repository name. 
    // If you name your repo "sentient-partners", keep this.
    // If you name it something else, change this line.
    base: '/sentient-partners/', 
  };
});