'use client';

import { Project, Space, Task } from '@/lib/firebase/firestore';
// context/AuthContext.js
import { createContext, useContext, useState } from 'react';

export interface SpacesContextProps {
  tableInfo: { [name: string]: TasksTableRowItem };
  setSpaces: (spaces: { [id: string]: Space }) => {};
}

const SpacesContext = createContext({} as SpacesContextProps);

interface TasksTableRowItem {
  element: Space | Project | Task;
  type: 'Space' | 'Project' | 'Task' | 'SubTask';
  path: string;
  isTableRowOpen: boolean;
}

export const SpacesProvider = ({ children }: { children: React.ReactNode }) => {
  const [tableInfo, setTableInfo] = useState<{ [name: string]: TasksTableRowItem }>({});

  return (
    <SpacesContext.Provider
      value={
        {
          tableInfo: tableInfo,
          setSpaces: (newSpaces: { [id: string]: Space }) => {
            setTableInfo(
              Object.fromEntries(
                Object.values(newSpaces).map((space) => [
                  space.name,
                  {
                    element: space,
                    type: 'Space',
                    path: space.name,
                    isTableRowOpen: false,
                  } as TasksTableRowItem,
                ]),
              ),
              Object.fromEntries(
                Object.values(newSpaces).map((space) => [
                  space.name,
                  {
                    element: space,
                    type: 'Space',
                    path: space.name,
                    isTableRowOpen: false,
                  } as TasksTableRowItem,
                ]),
              ),
            );
          },
        } as SpacesContextProps
      }
    >
      {children}
    </SpacesContext.Provider>
  );
};

export const useSpaces = () => useContext(SpacesContext);
