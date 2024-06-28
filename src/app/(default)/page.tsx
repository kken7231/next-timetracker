'use client';

import Link from 'next/link';
import { useAuth } from '@/app/context/AuthProvider';
import { Suspense, useEffect, useMemo, useState } from 'react';
import {
  Project,
  Space,
  constructSpaces,
  createProject,
  createSpace,
  createSubTask,
  createTask,
  getAllProjects,
  getAllSpaces,
  getAllTasks,
  getProjects,
  getSpaces,
  getSubTasks,
  getTasks,
} from '@/lib/firebase/firestore';
import { usePaging } from '../context/PagingProvider';
import TimelinePage from './page-timeline';
import TasksPage from './page-tasks';
import { SpacesProvider, useSpaces } from '../context/SpacesProvider';

// Force next.js to treat this route as server-side rendered
// Without this line, during the build process, next.js will treat this route as static and build a static HTML file for it
export const dynamic = 'force-dynamic';

export default function Home() {
  const { user, isLoading } = useAuth();
  const { currentPage } = usePaging();
  const [localIsLoading, setLocalIsLoading] = useState<boolean>(true);
  const { setSpaces } = useSpaces();

  useEffect(() => {
    setLocalIsLoading(isLoading);
  }, [isLoading]);

  async function load() {
    Promise.all([getAllSpaces(), getAllProjects(), getAllTasks()])
      .then((values) =>
        setSpaces(
          Object.fromEntries(
            constructSpaces(values[0], values[1], values[2]).map((space) => [space.id, space]),
          ),
        ),
      )
      .catch((error) => console.error(`Error when constructing the task tree: ${error}`));
  }

  useEffect(() => {
    if (user) {
      load();
    }
  }, [user]);

  return (
    <main className="content">
      <div className="container m-auto">
        {localIsLoading ? (
          <p className="text-center">Loading...</p>
        ) : user ? (
          currentPage.id === 'tasks' ? (
            <TasksPage />
          ) : (
            <TimelinePage />
          )
        ) : (
          <p className="text-center">You are not authenticated.</p>
        )}
      </div>
    </main>
  );
}
