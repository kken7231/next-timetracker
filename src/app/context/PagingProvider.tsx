'use client';

// context/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { firebaseConfig } from '@/lib/firebase/config';
import { User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import {
  onAuthStateChanged,
  signInWithEmail,
  signOut,
} from '@/lib/firebase/auth';

export const pages = ['aaaa', 'bbbb'] as const;
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
          pageTo: (to: Page) => setPage(to),
        } as PagingContextProps
      }
    >
      {children}
    </PagingContext.Provider>
  );
};

export const usePaging = () => useContext(PagingContext);
