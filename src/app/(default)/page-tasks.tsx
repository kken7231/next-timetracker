import {
  Project,
  Space,
  Task,
  s_createProject,
  s_createSpace,
  s_createSubTask,
  s_createTask,
} from '@/lib/firebase/firestore';
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import React, { Key, useEffect } from 'react';
import { GSymbolOutlined } from '../components/GSymbol';
import { useSpaces } from '../context/SpacesProvider';

interface TableRowItem {
  element: Space | Project | Task;
  type: 'Space' | 'Project' | 'Task' | 'SubTask';
  path: string;
  isOpen: boolean;
}

export default function TasksPage() {
  const { spaces } = useSpaces();
  const [items, setItems] = React.useState<{ [name: string]: TableRowItem }>({});

  React.useEffect(() => {
    setItems(
      Object.fromEntries(
        Object.values(spaces).map((space) => [
          space.name,
          { element: space, type: 'Space', path: space.name, isOpen: false } as TableRowItem,
        ]),
      ),
    );
  }, [spaces]);

  const sortedItems = React.useMemo(() => {
    return [...Object.values(items)].sort((a, b) => a.path.localeCompare(b.path));
  }, [items]);

  const renderCell = (item: TableRowItem, columnKey: Key) => {
    if (columnKey == 'LastTracked') {
      if (item.element.last_tracked.seconds == 0) {
        return 'Not yet tracked';
      } else {
        const d = new Date(item.element.last_tracked.seconds * 1000);
        return d.toLocaleString();
      }
    }

    if (item.type === 'Space') {
      switch (columnKey) {
        case 'Space':
          return item.element.name;
        case 'Project':
          const num = Object.entries((item.element as Space).projects).length;
          return (
            <span className="text-gray-500">
              {num == 0 ? 'No' : num} {num == 1 ? 'project' : 'projects'}
            </span>
          );
        default:
          return '';
      }
    } else if (item.type == 'Project') {
      switch (columnKey) {
        case 'Project':
          return item.element.name;
        case 'Task':
          const num = Object.entries((item.element as Project).tasks).length;
          return (
            <span className="text-gray-500">
              {num == 0 ? 'No' : num} {num == 1 ? 'task' : 'tasks'}
            </span>
          );
        default:
          return '';
      }
    } else if (item.type == 'Task') {
      switch (columnKey) {
        case 'Task':
          return item.element.name;
        case 'SubTask':
          const num = Object.entries((item.element as Task).subtasks).length;
          return (
            <span className="text-gray-500">
              {num == 0 ? 'No' : num} {num == 1 ? 'subtask' : 'subtasks'}
            </span>
          );
        default:
          return '';
      }
    } else if (item.type == 'SubTask') {
      switch (columnKey) {
        case 'SubTask':
          return item.element.name;
        default:
          return '';
      }
    } else {
      return '';
    }
  };

  const rowActionHandler = (key: Key) => {
    const pathComps = key.toString().split('/');
    if (pathComps.length == 1 && !items[pathComps[0]].isOpen) {
      // Space
      const space = items[pathComps[0]].element as Space;
      const projects = Object.fromEntries(
        Object.values(space.projects).map((project) => [
          project.name,
          {
            element: project,
            type: 'Project',
            path: `${space.name}/${project.name}`,
            isOpen: false,
          } as TableRowItem,
        ]),
      );
      const newItems = { ...items, ...projects };
      newItems[pathComps[0]] = {
        ...items[pathComps[0]],
        isOpen: true,
      };
      setItems(newItems);
    } else if (pathComps.length == 2 && !items[pathComps[1]].isOpen) {
      // Project
      const project = items[pathComps[1]].element as Project;
      const tasks = Object.fromEntries(
        Object.values(project.tasks).map((task) => [
          task.name,
          {
            element: task,
            type: 'Task',
            path: `${items[pathComps[1]].path}/${task.name}`,
            isOpen: false,
          } as TableRowItem,
        ]),
      );
      const newItems = { ...items, ...tasks };
      newItems[pathComps[1]] = {
        ...items[pathComps[1]],
        isOpen: true,
      };
      setItems(newItems);
    } else if (pathComps.length == 3 && !items[pathComps[2]].isOpen) {
      // Task
      const task = items[pathComps[2]].element as Task;
      const subtasks = Object.fromEntries(
        Object.values(task.subtasks).map((subtask) => [
          subtask.name,
          {
            element: subtask,
            type: 'SubTask',
            path: `${items[pathComps[2]].path}/${subtask.name}`,
            isOpen: false,
          } as TableRowItem,
        ]),
      );
      const newItems = { ...items, ...subtasks };
      newItems[pathComps[2]] = {
        ...items[pathComps[2]],
        isOpen: true,
      };
      setItems(newItems);
    }
  };

  return (
    <div>
      <Button
        onClick={(e: React.MouseEvent<HTMLElement>) => {
          s_createSpace('Personal').then((space_id) => {
            s_createProject(space_id, 'Misc').then((project_id) => {
              s_createTask(space_id, project_id, `task-${crypto.randomUUID()}`).then((task_id) => {
                s_createSubTask(space_id, project_id, task_id, `subtask-${crypto.randomUUID()}`);
              });
            });
          });
        }}
      ></Button>
      <Table
        aria-label="Example empty table"
        onRowAction={rowActionHandler}
        selectionMode="single"
        selectionBehavior="replace"
      >
        <TableHeader>
          <TableColumn key="Space">SPACE</TableColumn>
          <TableColumn key="Project">PROJECT</TableColumn>
          <TableColumn key="Task">TASK</TableColumn>
          <TableColumn key="SubTask">SUBTASK</TableColumn>
          <TableColumn key="LastTracked">LAST TRACKED</TableColumn>
        </TableHeader>
        <TableBody emptyContent={'No rows to display.'} items={sortedItems}>
          {(item) => (
            <TableRow key={item.path}>
              {(columnKey: Key) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
