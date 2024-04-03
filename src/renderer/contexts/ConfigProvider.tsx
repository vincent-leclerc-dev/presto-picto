import { ReactNode, createContext } from 'react';
import config, { type ConfigType } from '../config';

export const ConfigContext = createContext<ConfigType>(config);

export default function ConfigProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
}
