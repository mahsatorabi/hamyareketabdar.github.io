
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.446a86a402604c29a40160f0a2dac3f1',
  appName: 'همیار کتابدار',
  webDir: 'dist',
  server: {
    url: "https://446a86a4-0260-4c29-a401-60f0a2dac3f1.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    }
  }
};

export default config;
