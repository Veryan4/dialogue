export class AppConfig {
  backendApi: string;
  events: AppConfigEvents;
  storage: AppConfigStorage;
}

class AppConfigEvents {
  newTodo: string;
  itemsLeft: string;
  clearCompleted: string;
  newFilter: string;
}

class AppConfigStorage {
  darkMode: string;
}
