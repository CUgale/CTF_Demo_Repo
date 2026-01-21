import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type DashboardDesign = 'compact' | 'detailed' | 'minimal';

interface DashboardDesignContextType {
  design: DashboardDesign;
  setDesign: (design: DashboardDesign) => void;
}

const DashboardDesignContext = createContext<DashboardDesignContextType | undefined>(undefined);

const STORAGE_KEY = 'ctf-dashboard-design';

export const DashboardDesignProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [design, setDesignState] = useState<DashboardDesign>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return (saved === 'compact' || saved === 'detailed' || saved === 'minimal') ? saved : 'compact';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, design);
  }, [design]);

  const setDesign = (newDesign: DashboardDesign) => {
    setDesignState(newDesign);
  };

  return (
    <DashboardDesignContext.Provider value={{ design, setDesign }}>
      {children}
    </DashboardDesignContext.Provider>
  );
};

export const useDashboardDesign = () => {
  const context = useContext(DashboardDesignContext);
  if (context === undefined) {
    throw new Error('useDashboardDesign must be used within a DashboardDesignProvider');
  }
  return context;
};

