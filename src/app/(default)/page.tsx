'use client';

import Link from 'next/link';
import { useAuth } from '@/app/context/AuthProvider';
import { useEffect, useState } from 'react';
import { Button } from '@headlessui/react';
import { getSpaces } from '@/lib/firebase/firestore';

// Force next.js to treat this route as server-side rendered
// Without this line, during the build process, next.js will treat this route as static and build a static HTML file for it
export const dynamic = 'force-dynamic';

export default function Home() {
  const { user, isLoading } = useAuth();
  const [localIsLoading, setLocalIsLoading] = useState<boolean>(true);
  useEffect(() => {
    setLocalIsLoading(isLoading);
  }, [isLoading]);

  return (
    <main className="content">
      <div className="container m-auto">
        {localIsLoading ? (
          <p className="text-center">Loading...</p>
        ) : user ? (
          <section className="features">
            <Button
              id="btn"
              onClick={(e: React.MouseEvent<HTMLElement>) => getSpaces()}
            >
              getSpaces
            </Button>
            <article className="card">
              <h2>Scalable, serverless backends</h2>
              <p>
                Dynamic content is served by{' '}
                <Link
                  href="https://cloud.google.com/run/docs/overview/what-is-cloud-run"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cloud Run
                </Link>
                , a fully managed container that scales up and down with demand.
                Visit{' '}
                <Link href="/ssr">
                  <code>/ssr</code>
                </Link>{' '}
                and{' '}
                <Link href="/ssr/streaming">
                  <code>/ssr/streaming</code>
                </Link>{' '}
                to see the server in action.
              </p>
            </article>
            <article className="card">
              <h2>Global CDN</h2>
              <p>
                Cached content is served by{' '}
                <Link
                  href="https://cloud.google.com/cdn/docs/overview"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Cloud CDN
                </Link>
                , a fast and secure way to host cached content globally. Visit
                <Link href="/ssg">
                  {' '}
                  <code>/ssg</code>
                </Link>{' '}
              </p>
            </article>
          </section>
        ) : (
          <p className="text-center">You are not authenticated.</p>
        )}
      </div>
    </main>
  );
}
