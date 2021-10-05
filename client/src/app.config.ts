import { AppConfig } from './models/app-config.model';

export const appConfig: AppConfig = {
  backendApi: 'http://localhost:5057/',
  events: {
    newTodo: 'newTodo',
    itemsLeft: 'itemsLeft',
    clearCompleted: 'clearCompleted',
    newFilter: 'newFilter',
  },
  storage: {
    darkMode: 'todo-dark-mode',
  },
};
