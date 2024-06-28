'use client';

// context/AuthContext.js
import { createContext, useContext, useState } from 'react';

export const pages = [
  {
    id: 'tasks',
    label: 'Tasks',
  },
  { id: 'timeline', label: 'Timeline' },
];
export type Page = (typeof pages)[number];

export interface PagingContextProps {
  currentPage: Page;
  pageTo: (to: Page) => {};
}

const PagingContext = createContext({} as PagingContextProps);

export const PagingProvider = ({ children }: { children: React.ReactNode }) => {
  const [page, setPage] = useState<Page>(pages[0]);

  return (
    <PagingContext.Provider
      value={
        {
          currentPage: page,
          pageTo: (to: Page) => {
            setPage(to);
            console.log(`page set to ${to.label}`);
          },
        } as PagingContextProps
      }
    >
      {children}
    </PagingContext.Provider>
  );
};

export const usePaging = () => useContext(PagingContext);
