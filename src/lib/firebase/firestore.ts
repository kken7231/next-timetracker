import {
  DocumentData,
  Query,
  Timestamp,
  arrayUnion,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from './clientApp';

export interface StoredSpace {
  name: string;
  id: string;
  project_ids: string[];
  last_tracked: Timestamp;
}

export interface StoredProject {
  name: string;
  id: string;
  parent_space: string;
  task_ids: string[];
  last_tracked: Timestamp;
}

export interface StoredTask {
  name: string;
  id: string;
  parent_path: string;
  subtask_ids: string[];
  last_tracked: Timestamp;
}

export class TimeTracked {
  space: string;
  project: string;
  task: string;
  subtask: string | null;
  time_start: Timestamp;
  time_end: Timestamp | null;

  constructor(
    space: string,
    project: string,
    task: string,
    subtask: string | null,
    time_start: Timestamp,
    time_end: Timestamp | null,
  ) {
    this.space = space;
    this.project = project;
    this.task = task;
    this.subtask = subtask;
    this.time_start = time_start;
    this.time_end = time_end;
  }
}

export interface QueryFilter {
  name: string | undefined;
  id: string | undefined;
  last_tracked_from: Timestamp | undefined;
  last_tracked_to: Timestamp | undefined;
  last_tracked_top: number | undefined;
}

const QueryFilterNone = {} as QueryFilter;

function applyQueryFilters(
  q: Query<DocumentData, DocumentData>,
  { name, id, last_tracked_from, last_tracked_to, last_tracked_top }: QueryFilter,
): Query<DocumentData, DocumentData> {
  if (name) {
    q = query(q, where('name', '==', name));
  }
  if (id) {
    q = query(q, where('id', '==', id));
  }
  if (last_tracked_from) {
    q = query(q, where('last_tracked', '>=', last_tracked_from));
  }
  if (last_tracked_to) {
    q = query(q, where('last_tracked', '<=', last_tracked_from));
  }
  q = query(q, orderBy('last_tracked', 'asc'));
  if (last_tracked_top) {
    q = query(q, limit(last_tracked_top));
  }
  return q;
}

export async function getCurrent(): Promise<TimeTracked | null> {
  return null;
}

export async function getToday(): Promise<[TimeTracked] | []> {
  return [];
}

export async function getThisWeek(): Promise<[TimeTracked] | []> {
  return [];
}

export async function getAllSpaces(filters: QueryFilter = QueryFilterNone): Promise<StoredSpace[]> {
  let q = query(collection(db, 'spaces'));
  q = applyQueryFilters(q, filters);
  const querySnapshot = await getDocs(q);
  var fetchedSpaces: StoredSpace[] = [];
  querySnapshot.docs.map((doc) => {
    if (doc.data().name && doc.data().last_tracked) {
      fetchedSpaces.push(doc.data() as StoredSpace);
    } else {
      console.log(`Error fetching a space ${doc.id}`);
    }
  });
  return fetchedSpaces;
}

export async function getAllProjects(
  filters: QueryFilter = QueryFilterNone,
): Promise<StoredProject[]> {
  let q = query(collection(db, 'projects'));
  q = applyQueryFilters(q, filters);
  const querySnapshot = await getDocs(q);
  var fetchedProjects: StoredProject[] = [];
  querySnapshot.docs.map((doc) => {
    if (doc.data().name && doc.data().last_tracked) {
      fetchedProjects.push(doc.data() as StoredProject);
    } else {
      console.log(`Error fetching a project ${doc.id}`);
    }
  });
  return fetchedProjects;
}

export async function getAllTasks(filters: QueryFilter = QueryFilterNone): Promise<StoredTask[]> {
  let q = query(collection(db, 'tasks'));
  q = applyQueryFilters(q, filters);
  const querySnapshot = await getDocs(q);
  var fetchedTasks: StoredTask[] = [];
  querySnapshot.docs.map((doc) => {
    if (doc.data().name && doc.data().last_tracked) {
      fetchedTasks.push(doc.data() as StoredTask);
    } else {
      console.log(`Error fetching a task ${doc.id}`);
    }
  });
  return fetchedTasks;
}

//////////////////////////////////////
//
// Spaces
//
// Space {
//   name: string;
//   id: string;
//   project_ids: string[];
//   last_tracked: Timestamp;
// }
//
//////////////////////////////////////

export async function getSpaces(filters: QueryFilter = QueryFilterNone): Promise<StoredSpace[]> {
  let q = query(collection(db, 'spaces'));
  q = applyQueryFilters(q, filters);
  const querySnapshot = await getDocs(q);
  var fetchedSpaces: StoredSpace[] = [];
  querySnapshot.docs.map((doc) => {
    if (doc.data().name && doc.data().last_tracked) {
      fetchedSpaces.push(doc.data() as StoredSpace);
    } else {
      console.log(`Error fetching a space ${doc.id}`);
    }
  });
  return fetchedSpaces;
}

export async function createSpace(space_name: string): Promise<string> {
  const space_id = crypto.randomUUID();
  await setDoc(doc(db, 'spaces', space_id), {
    name: space_name,
    id: space_id,
    project_ids: [],
    last_tracked: Timestamp.fromMillis(0),
  } as StoredSpace).catch((e) => {
    console.error(`Error on creating a space: ${e}`);
    throw e;
  });
  return space_id;
}

export async function s_createSpace(space_name: string): Promise<string> {
  try {
    const space = await lookupSpace(space_name);
    if (space && space.id) {
      return space.id;
    }
  } catch (e) {
    console.error(`Error on creating a space during lookup: ${e}`);
    throw e;
  }
  return createSpace(space_name);
}

export async function lookupSpace(space_name: string): Promise<StoredSpace | null> {
  const spaces = await getSpaces({ name: space_name } as QueryFilter).catch((e) => {
    console.error(`Error on looking up the space ${space_name}: ${e}`);
    throw e;
  });
  if (!spaces || spaces.length == 0) {
    return null;
  } else if (spaces.length != 1) {
    throw new Error(`Found more than one space: ${spaces.length}`);
  }
  return spaces[0];
}

//////////////////////////////////////
//
// Projects
//
// Project {
//   name: string;
//   id: string;
//   parent_space: string;
//   task_ids: string[];
//   last_tracked: Timestamp;
// }
//
//////////////////////////////////////

export async function getProjects(
  space_id: string,
  filters: QueryFilter = QueryFilterNone,
): Promise<StoredProject[]> {
  let q = query(collection(db, 'projects'));
  q = query(q, where('parent_space', '==', `${space_id}`));
  q = applyQueryFilters(q, filters);
  const querySnapshot = await getDocs(q);
  var fetchedProjects: StoredProject[] = [];
  querySnapshot.docs.forEach((doc) => {
    if (doc.data().name && doc.data().last_tracked) {
      fetchedProjects.push(doc.data() as StoredProject);
    } else {
      console.log(`Error fetching a project ${doc.id} in the space ${space_id}`);
    }
  });
  return fetchedProjects;
}

export async function createProject(space_id: string, project_name: string): Promise<string> {
  const project_id = crypto.randomUUID();
  await setDoc(doc(db, 'projects', project_id), {
    name: project_name,
    parent_space: space_id,
    id: project_id,
    last_tracked: Timestamp.fromMillis(0),
    task_ids: [],
  } as StoredProject).catch((e) => {
    console.error(`Error on creating a project: ${e}`);
    throw e;
  });
  await updateDoc(doc(db, 'spaces', space_id), {
    project_ids: arrayUnion(project_id),
  }).catch((e) => {
    console.error(`Error on creating a project: ${e}`);
    throw e;
  });
  return project_id;
}

export async function s_createProject(space_id: string, project_name: string): Promise<string> {
  try {
    const project = await lookupProject(space_id, project_name);
    if (project && project.id) {
      return project.id;
    }
  } catch (e) {
    console.error(`Error on creating a project during lookup: ${e}`);
    throw e;
  }
  return createProject(space_id, project_name);
}

export async function lookupProject(
  space_id: string,
  project_name: string,
): Promise<StoredProject | null> {
  const projects = await getProjects(space_id, {
    name: project_name,
  } as QueryFilter).catch((e) => {
    console.error(`Error on looking up the project ${project_name} in the space ${space_id}: ${e}`);
    throw e;
  });
  if (!projects || projects.length == 0) {
    return null;
  } else if (projects.length != 1) {
    throw new Error(`Found more than one project: ${projects.length}`);
  }
  return projects[0];
}

//////////////////////////////////////
//
// Tasks
//
// Task {
//   name: string;
//   id: string;
//   parent_path: string;
//   subtask_ids: string[];
//   last_tracked: Timestamp;
// }
//
//////////////////////////////////////

export async function getTasks(
  space_id: string,
  project_id: string,
  filters: QueryFilter = QueryFilterNone,
): Promise<StoredTask[]> {
  let q = query(collection(db, 'tasks'));
  q = applyQueryFilters(q, filters);
  q = query(q, where('parent_path', '==', `${space_id}/${project_id}`));
  const querySnapshot = await getDocs(q);
  var fetchedTasks: StoredTask[] = [];
  querySnapshot.docs.forEach((doc) => {
    if (doc.data().name && doc.data().last_tracked) {
      fetchedTasks.push(doc.data() as StoredTask);
    } else {
      console.log(`Error fetching a task ${doc.id} in the project ${space_id}/${project_id}`);
    }
  });
  return fetchedTasks;
}

export async function createTask(space_id: string, project_id: string, task_name: string) {
  const task_id = crypto.randomUUID();
  await setDoc(doc(db, 'tasks', task_id), {
    name: task_name,
    id: task_id,
    parent_path: `${space_id}/${project_id}`,
    last_tracked: Timestamp.fromMillis(0),
    subtask_ids: [],
  } as StoredTask).catch((e) => {
    console.error(`Error on creating a task: ${e}`);
    throw e;
  });
  await updateDoc(doc(db, 'projects', project_id), {
    task_ids: arrayUnion(task_id),
  }).catch((e) => {
    console.error(`Error on creating a task: ${e}`);
    throw e;
  });
  return task_id;
}

export async function s_createTask(
  space_id: string,
  project_id: string,
  task_name: string,
): Promise<string> {
  try {
    const task = await lookupTask(space_id, project_id, task_name);
    if (task && task.id) {
      return task.id;
    }
  } catch (e) {
    console.error(`Error on creating a task during lookup: ${e}`);
    throw e;
  }
  return createTask(space_id, project_id, task_name);
}

export async function lookupTask(
  space_id: string,
  project_id: string,
  task_name: string,
): Promise<StoredTask | null> {
  const tasks = await getTasks(space_id, project_id, {
    name: task_name,
  } as QueryFilter).catch((e) => {
    console.error(
      `Error on looking up the task ${task_name} in the project ${space_id}/${project_id}: ${e}`,
    );
    throw e;
  });
  if (!tasks || tasks.length == 0) {
    return null;
  } else if (tasks.length != 1) {
    throw new Error('Found more than one task');
  }
  return tasks[0];
}

//////////////////////////////////////
//
// Subtasks
//
//////////////////////////////////////

export async function getSubTasks(
  space_id: string,
  project_id: string,
  task_id: string,
  filters: QueryFilter = QueryFilterNone,
): Promise<StoredTask[]> {
  let q = query(collection(db, 'tasks'));
  q = applyQueryFilters(q, filters);
  q = query(q, where('parent_path', '==', `${space_id}/${project_id}/${task_id}`));
  const querySnapshot = await getDocs(q);
  var fetchedSubTasks: StoredTask[] = [];
  querySnapshot.docs.forEach((doc) => {
    if (doc.data().name && doc.data().last_tracked) {
      fetchedSubTasks.push(doc.data() as StoredTask);
    } else {
      console.log(`Error fetching a subtask ${doc.id} in the task ${task_id}`);
    }
  });
  return fetchedSubTasks;
}

export async function createSubTask(
  space_id: string,
  project_id: string,
  task_id: string,
  subtask_name: string,
) {
  const subtask_id = crypto.randomUUID();
  await setDoc(doc(db, 'tasks', subtask_id), {
    name: subtask_name,
    last_tracked: Timestamp.fromMillis(0),
    id: subtask_id,
    parent_path: `${space_id}/${project_id}/${task_id}`,
  } as StoredTask).catch((e) => {
    console.error(`Error on creating a subtask: ${e}`);
    throw e;
  });
  await updateDoc(doc(db, 'tasks', task_id), {
    subtask_ids: arrayUnion(subtask_id),
  }).catch((e) => {
    console.error(`Error on creating a task: ${e}`);
    throw e;
  });
  return subtask_id;
}

export async function s_createSubTask(
  space_id: string,
  project_id: string,
  task_id: string,
  subtask_name: string,
): Promise<string> {
  try {
    const subtask = await lookupSubTask(space_id, project_id, task_id, subtask_name);
    if (subtask && subtask.id) {
      return subtask.id;
    }
  } catch (e) {
    console.error(`Error on creating a task during lookup: ${e}`);
    throw e;
  }
  return createSubTask(space_id, project_id, task_id, subtask_name);
}

export async function lookupSubTask(
  space_id: string,
  project_id: string,
  task_id: string,
  subtask_name: string,
): Promise<StoredTask | null> {
  const subtasks = await getSubTasks(space_id, project_id, task_id, {
    name: subtask_name,
  } as QueryFilter).catch((e) => {
    console.error(
      `Error on looking up the subtask ${subtask_name} in the task ${space_id}/${project_id}/${task_id}: ${e}`,
    );
    throw e;
  });
  if (!subtasks || subtasks.length == 0) {
    return null;
  } else if (subtasks.length != 1) {
    throw new Error('Found more than one subtask');
  }
  return subtasks[0];
}
