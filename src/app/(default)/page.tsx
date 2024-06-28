'use client';

import { useAuth } from '@/app/context/AuthProvider';
import { useEffect, useState } from 'react';
import { getAllProjects, getAllSpaces, getAllTasks } from '@/lib/firebase/firestore';
import { usePaging } from '../context/PagingProvider';
import TimelinePage from './page-timeline';
import TasksPage from './page-tasks';
import { useSpaces } from '../context/DbProvider';

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
      .then((values) => setSpaces(values[0], values[1], values[2]))
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
