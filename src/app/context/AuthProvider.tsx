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

export interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  signin: () => Promise<void>;
  signout: () => Promise<void>;
}

const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const serializedFirebaseConfig = encodeURIComponent(
        JSON.stringify(firebaseConfig),
      );
      const serviceWorkerUrl = `/auth-service-worker.js?firebaseConfig=${serializedFirebaseConfig}`;

      navigator.serviceWorker
        .register(serviceWorkerUrl)
        .then((registration) => console.log('scope is: ', registration.scope));
    }
  }, []);

  useEffect(() => {
    console.log(`isLoading ${isLoading}`);
  }, [isLoading]);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onAuthStateChanged((authUser) => {
      setIsLoading(false);
      setUser(authUser);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signin = async (email: string, password: string) => {
    await signInWithEmail(email, password);
  };

  const signout = async () => {
    await signOut();
  };

  useEffect(() => {
    setIsLoading(true);
    onAuthStateChanged((authUser) => {
      setIsLoading(false);
      if (user === undefined) return;

      // refresh when user changed to ease testing
      if (user?.email !== authUser?.email) {
        router.refresh();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <AuthContext.Provider
      value={
        {
          user: user,
          isLoading: isLoading,
          signin,
          signout,
        } as AuthContextProps
      }
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
