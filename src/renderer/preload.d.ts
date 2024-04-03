import { ElectronHandler } from '../main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
    versions: {
      chrome: () => string;
      node: () => string;
      electron: () => string;
    };
  }
}

export {};
