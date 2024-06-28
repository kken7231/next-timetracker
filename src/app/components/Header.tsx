'use client';
import React, { Key, useEffect, useState } from 'react';
import { GSymbolOutlined } from './GSymbol';
import { useAuth } from '@/app/context/AuthProvider';
import { pages, usePaging } from '@/app/context/PagingProvider';
import {
  Button,
  Listbox,
  ListboxItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
  Selection,
  Tab,
  Tabs,
} from '@nextui-org/react';
import { useSpaces } from '../context/SpacesProvider';
import { Project, Space, Task } from '@/lib/firebase/firestore';

export default function Header() {
  const { user, isLoading, signout } = useAuth();
  const { spaces } = useSpaces();
  const [selectedSpace, setSelectedSpace] = React.useState<Selection>(new Set([]));
  const [selectedProject, setSelectedProject] = React.useState<Selection>(new Set([]));
  const [selectedTask, setSelectedTask] = React.useState<Selection>(new Set([]));
  const [selectedSubTask, setSelectedSubTask] = React.useState<Selection>(new Set([]));
  const [canRun, setCanRun] = React.useState<boolean>(false);

  const { pageTo } = usePaging();
  const [selectedPage, setSelectedPage] = useState<string>(pages[0].id);
  useEffect(() => {
    pageTo(pages.filter((p) => p.id === selectedPage)[0]);
  }, [selectedPage]);

  const [localIsLoading, setLocalIsLoading] = useState<boolean>(true);
  useEffect(() => {
    setLocalIsLoading(isLoading);
  }, [isLoading]);

  const handleSignOut = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    signout();
  };

  const sortedSpaces = React.useMemo(() => {
    return [...Object.values(spaces)].sort((a, b) => a.name.localeCompare(b.name));
  }, [spaces]);

  function sortedProjects(space: Space) {
    return [...Object.values(space.projects)].sort((a, b) => a.name.localeCompare(b.name));
  }

  function sortedTasks(project: Project) {
    return [...Object.values(project.tasks)].sort((a, b) => a.name.localeCompare(b.name));
  }

  function sortedSubTasks(task: Task) {
    return [...Object.values(task.subtasks)].sort((a, b) => a.name.localeCompare(b.name));
  }

  useEffect(() => {
    if (Array.from(selectedSpace).length > 0) {
      setSelectedProject(new Set([]));
      setSelectedTask(new Set([]));
      setSelectedSubTask(new Set([]));
      if (canRun) setCanRun(false);
    }
  }, [selectedSpace]);

  useEffect(() => {
    if (Array.from(selectedProject).length > 0) {
      setSelectedTask(new Set([]));
      setSelectedSubTask(new Set([]));
      if (canRun) setCanRun(false);
    }
  }, [selectedProject]);

  useEffect(() => {
    if (Array.from(selectedTask).length > 0) {
      setSelectedSubTask(new Set([]));
      const available =
        selectedPage &&
        selectedPage != 'all' &&
        Array.from(selectedTask).length != 0 &&
        selectedSpace &&
        selectedSpace != 'all' &&
        Array.from(selectedSpace).length != 0 &&
        selectedTask &&
        selectedTask != 'all' &&
        Array.from(selectedTask).length != 0 &&
        Object.values(
          spaces[Array.from(selectedSpace)[0]].projects[Array.from(selectedProject)[0]].tasks[
            Array.from(selectedTask)[0]
          ].subtasks,
        ).length == 0;
      if (available && !canRun) setCanRun(true);
      else if (!available && canRun) setCanRun(false);
    }
  }, [selectedTask]);

  useEffect(() => {
    if (Array.from(selectedSubTask).length > 0) {
      const available =
        selectedPage &&
        selectedPage != 'all' &&
        Array.from(selectedTask).length != 0 &&
        selectedSpace &&
        selectedSpace != 'all' &&
        Array.from(selectedSpace).length != 0 &&
        selectedTask &&
        selectedTask != 'all' &&
        Array.from(selectedTask).length != 0 &&
        Object.values(
          spaces[Array.from(selectedSpace)[0]].projects[Array.from(selectedProject)[0]].tasks[
            Array.from(selectedTask)[0]
          ].subtasks,
        ).length > 0;
      selectedSubTask &&
        selectedSubTask != 'all' &&
        Array.from(selectedSubTask).length != 0 &&
        Object.values(
          spaces[Array.from(selectedSpace)[0]].projects[Array.from(selectedProject)[0]].tasks[
            Array.from(selectedTask)[0]
          ].subtasks[Array.from(selectedSubTask)[0]].subtasks,
        ).length == 0;

      if (available && !canRun) setCanRun(true);
      else if (!available && canRun) setCanRun(false);
    }
  }, [selectedSubTask]);

  return (
    <header>
      <GSymbolOutlined fill={0} weight={400} opticalSize={36} iconColor="black">
        timer
      </GSymbolOutlined>

      {user && (
        <>
          <Tabs
            aria-label="Dynamic tabs"
            items={pages}
            selectedKey={selectedPage}
            onSelectionChange={setSelectedPage as (k: Key) => void}
          >
            {(item) => <Tab key={item.id} title={item.label} />}
          </Tabs>

          <Select
            items={sortedSpaces}
            selectedKeys={selectedSpace}
            onSelectionChange={setSelectedSpace}
            label="Select Space"
            className="max-w-xs"
          >
            {(item) => <SelectItem key={item.id}>{item.name}</SelectItem>}
          </Select>

          <Select
            items={
              selectedSpace && selectedSpace != 'all' && Array.from(selectedSpace).length > 0
                ? sortedProjects(spaces[Array.from(selectedSpace)[0]])
                : []
            }
            selectedKeys={selectedProject}
            onSelectionChange={setSelectedProject}
            isDisabled={Array.from(selectedSpace).length == 0}
            label="Select Project"
            className="max-w-xs"
          >
            {(item) => <SelectItem key={item.id}>{item.name}</SelectItem>}
          </Select>

          <Select
            items={
              selectedProject && selectedProject != 'all' && Array.from(selectedProject).length > 0
                ? sortedTasks(
                    spaces[Array.from(selectedSpace)[0]].projects[Array.from(selectedProject)[0]],
                  )
                : []
            }
            selectedKeys={selectedTask}
            onSelectionChange={setSelectedTask}
            isDisabled={Array.from(selectedProject).length == 0}
            label="Select Task"
            className="max-w-xs"
          >
            {(item) => <SelectItem key={item.id}>{item.name}</SelectItem>}
          </Select>

          <Select
            items={
              selectedTask && selectedTask != 'all' && Array.from(selectedTask).length > 0
                ? sortedSubTasks(
                    spaces[Array.from(selectedSpace)[0]].projects[Array.from(selectedProject)[0]]
                      .tasks[Array.from(selectedTask)[0]],
                  )
                : []
            }
            selectedKeys={selectedSubTask}
            onSelectionChange={setSelectedSubTask}
            isDisabled={
              Array.from(selectedTask).length == 0 ||
              Object.values(
                spaces[Array.from(selectedSpace)[0]].projects[Array.from(selectedProject)[0]].tasks[
                  Array.from(selectedTask)[0]
                ].subtasks,
              ).length == 0
            }
            label="Select SubTask"
            className="max-w-xs"
          >
            {(item) => <SelectItem key={item.id}>{item.name}</SelectItem>}
          </Select>

          <button
            className="flex  rounded-full p-1 disabled:bg-errorContainer disabled:text-onErrorContainer"
            disabled={!canRun}
          >
            <GSymbolOutlined
              fill={1}
              opticalSize={36}
              iconColor={canRun ? 'onErrorContainer' : 'onSurface'}
            >
              play_arrow
            </GSymbolOutlined>
          </button>
        </>
      )}

      {localIsLoading ? (
        <></>
      ) : user ? (
        // Authenticated
        <Popover placement="bottom">
          <PopoverTrigger>
            <button className="flex">
              <GSymbolOutlined fill={0} weight={400} opticalSize={36} iconColor="black">
                person
              </GSymbolOutlined>
            </button>
          </PopoverTrigger>
          <PopoverContent>
            <Listbox
              variant="faded"
              aria-label="listbox"
              topContent={<p className="text-onSurface/50">{user.email?.split('@')[0]}</p>}
            >
              <ListboxItem
                key="signout"
                startContent={
                  <GSymbolOutlined fill={0} weight={300} opticalSize={24} iconColor="black">
                    logout
                  </GSymbolOutlined>
                }
                onClick={handleSignOut}
              >
                Sign out
              </ListboxItem>
            </Listbox>
          </PopoverContent>
        </Popover>
      ) : (
        // Not Authenticated
        <a href="/signin">
          <GSymbolOutlined fill={0} weight={300} opticalSize={24} iconColor="black">
            login
          </GSymbolOutlined>
        </a>
      )}
    </header>
  );
}
