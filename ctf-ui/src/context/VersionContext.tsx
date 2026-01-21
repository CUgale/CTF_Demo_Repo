import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UIVersion = 'v1' | 'v2';

interface VersionContextType {
  version: UIVersion;
  setVersion: (version: UIVersion) => void;
  toggleVersion: () => void;
}

const VersionContext = createContext<VersionContextType | undefined>(undefined);

const STORAGE_KEY = 'ctf-ui-version';

export const VersionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [version, setVersionState] = useState<UIVersion>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return (saved === 'v1' || saved === 'v2') ? saved : 'v1';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, version);
  }, [version]);

  const setVersion = (newVersion: UIVersion) => {
    setVersionState(newVersion);
  };

  const toggleVersion = () => {
    setVersionState(prev => prev === 'v1' ? 'v2' : 'v1');
  };

  return (
    <VersionContext.Provider value={{ version, setVersion, toggleVersion }}>
      {children}
    </VersionContext.Provider>
  );
};

export const useVersion = () => {
  const context = useContext(VersionContext);
  if (context === undefined) {
    throw new Error('useVersion must be used within a VersionProvider');
  }
  return context;
};

