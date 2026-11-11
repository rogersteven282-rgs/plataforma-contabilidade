import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/client';

const ConfigContext = createContext(null);

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    api.get('/config').then(setConfig).catch(() => setConfig({}));
  }, []);

  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
}

export function useConfig() {
  return useContext(ConfigContext);
}
