'use client';

import { StoredProject, StoredSpace, StoredTask } from '@/lib/firebase/firestore';
// context/AuthContext.js
import { createContext, useContext, useState } from 'react';

export interface SpacesContextProps {
  spaces: { [id: string]: Space };
  projects: { [id: string]: Project };
  tasks: { [id: string]: Task };
  subtasks: { [id: string]: Task };
  tableInfo: { [id: string]: TasksTableRowItem };
  setSpaces: (
    stored_spaces: StoredSpace[],
    stored_projects: StoredProject[],
    stored_tasks: StoredTask[],
  ) => {};
}

const SpacesContext = createContext({} as SpacesContextProps);

export interface Space {
  name: string;
  id: string;
  projects: { [id: string]: Project };
  last_tracked: Date;
}

export interface Project {
  name: string;
  id: string;
  parent_space: string;
  tasks: { [id: string]: Task };
  last_tracked: Date;
}

export interface Task {
  name: string;
  id: string;
  parent_path: string;
  last_tracked: Date;
  subtasks: { [id: string]: Task };
  isSubtask: boolean;
}

export interface TrackedTime {
  time_start: Date;
  time_end: Date;
}

interface TasksTableRowItem {
  element: Space | Project | Task;
  type: 'Space' | 'Project' | 'Task' | 'SubTask';
  path: string;
  isTableRowOpen: boolean;
}

export const DbProvider = ({ children }: { children: React.ReactNode }) => {
  const [spaces, setSpaces] = useState<{ [id: string]: Space }>({});
  const [projects, setProjects] = useState<{ [id: string]: Project }>({});
  const [tasks, setTasks] = useState<{ [id: string]: Task }>({});
  const [subtasks, setSubTasks] = useState<{ [id: string]: Task }>({});
  const [tableInfo, setTableInfo] = useState<{ [id: string]: TasksTableRowItem }>({});

  return (
    <SpacesContext.Provider
      value={
        {
          spaces: spaces,
          projects: projects,
          tasks: tasks,
          subtasks: subtasks,
          tableInfo: tableInfo,
          setSpaces: (
            stored_spaces: StoredSpace[],
            stored_projects: StoredProject[],
            stored_tasks: StoredTask[],
          ) => {
            var newSpacesCollection = constructSpaces(stored_spaces, stored_projects, stored_tasks);
            setSpaces(newSpacesCollection.spaces);
            setProjects(newSpacesCollection.projects);
            setTasks(newSpacesCollection.tasks);
            setSubTasks(newSpacesCollection.subtasks);
            setTableInfo(
              Object.fromEntries(
                Object.entries(newSpacesCollection.spaces).map((entry) => [
                  entry[0],
                  {
                    element: entry[1],
                    type: 'Space',
                    path: entry[1].name,
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

export function constructSpaces(
  stored_spaces: StoredSpace[],
  stored_projects: StoredProject[],
  stored_tasks: StoredTask[],
): {
  spaces: { [id: string]: Space };
  projects: { [id: string]: Project };
  tasks: { [id: string]: Task };
  subtasks: { [id: string]: Task };
} {
  var spaces: { [id: string]: Space } = {};
  var projects: { [id: string]: Project } = {};
  var tasks: { [id: string]: Task } = {};
  var subtasks: { [id: string]: Task } = {};

  // subtasks
  stored_tasks.forEach((stored_task) => {
    if (stored_task.parent_path.length > 73) {
      subtasks[stored_task.id] = {
        name: stored_task.name,
        id: stored_task.id,
        parent_path: stored_task.parent_path,
        last_tracked: new Date(stored_task.last_tracked.seconds * 1000),
        subtasks: {},
        isSubtask: true,
      } as Task;
    }
  });

  // tasks
  stored_tasks.forEach((stored_task) => {
    if (stored_task.parent_path.length == 73) {
      tasks[stored_task.id] = {
        name: stored_task.name,
        id: stored_task.id,
        parent_path: stored_task.parent_path,
        last_tracked: new Date(stored_task.last_tracked.seconds * 1000),
        subtasks: Object.fromEntries(
          stored_task.subtask_ids.map((subtask_id) => {
            if (subtasks[subtask_id]) return [subtask_id, subtasks[subtask_id]];
            else throw new Error(`SubTask ${subtask_id} not found [task: ${stored_task.id}]`);
          }),
        ),
        isSubtask: false,
      } as Task;
    }
    console.log(tasks[stored_task.id]);
  });

  // projects
  stored_projects.forEach((stored_project) => {
    projects[stored_project.id] = {
      name: stored_project.name,
      id: stored_project.id,
      parent_space: stored_project.parent_space,
      last_tracked: new Date(stored_project.last_tracked.seconds * 1000),
      tasks: Object.fromEntries(
        stored_project.task_ids.map((task_id) => {
          if (tasks[task_id]) return [task_id, tasks[task_id]];
          else throw new Error(`Task ${task_id} not found [project: ${stored_project.id}]`);
        }),
      ),
    } as Project;
  });

  // spaces
  stored_spaces.forEach((stored_space) => {
    spaces[stored_space.id] = {
      name: stored_space.name,
      id: stored_space.id,
      last_tracked: new Date(stored_space.last_tracked.seconds * 1000),
      projects: Object.fromEntries(
        stored_space.project_ids.map((project_id) => {
          if (projects[project_id]) return [project_id, projects[project_id]];
          else throw new Error(`Project ${project_id} not found [space: ${stored_space.id}]`);
        }),
      ),
    } as Space;
  });

  return {
    spaces: spaces,
    projects: projects,
    tasks: tasks,
    subtasks: subtasks,
  };
}

export const useSpaces = () => useContext(SpacesContext);
