import { appConfig } from '../app.config';
import { CreateToDo, ToDo } from '../models/todo.model';

export const todoService = {
  getToDos,
  createToDo,
  updateToDos,
  clearCompletedToDos,
  removeAToDo,
};

const endpoint = appConfig.backendApi + 'todo/';
const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

function getToDos(): Promise<ToDo[]> {
  return fetch(endpoint).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<ToDo[]>;
  });
}

function createToDo(todo: CreateToDo): Promise<ToDo> {
  return fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(todo),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<ToDo>;
  });
}

function updateToDos(todos: ToDo[]): Promise<ToDo[]> {
  return fetch(endpoint, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(todos),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<ToDo[]>;
  });
}

function clearCompletedToDos(): Promise<Record<string, number>> {
  return fetch(endpoint, {
    method: 'DELETE',
    headers,
  }).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<Record<string, number>>;
  });
}

function removeAToDo(todoId: string): Promise<Record<string, string>> {
  return fetch(endpoint + todoId, {
    method: 'DELETE',
    headers,
  }).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<Record<string, string>>;
  });
}
