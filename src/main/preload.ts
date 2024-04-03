import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

const os = require('os');

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // we can also expose variables, not just functions
});

contextBridge.exposeInMainWorld('ipcRenderer', {
  homeDir: () => os.homedir(),
  osVersion: () => os.arch(),
  send: (channel: string, data: any) => {
    return ipcRenderer.send(channel, data);
  },
  on: (channel: string, func: (...args: any[]) => void) => {
    return ipcRenderer.on(channel, (event, ...args) => func(event, ...args));
  },
  off: (channel: string) => {
    return ipcRenderer.removeAllListeners(channel);
  },
});

export type Channels = 'ipc-test';

const electronHandler = {
  ipcRenderer: {
    homeDir: () => os.homedir(),
    osVersion: () => os.arch(),
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
