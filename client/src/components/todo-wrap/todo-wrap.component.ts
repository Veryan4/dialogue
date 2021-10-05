import { appConfig } from '../../app.config';
import { ToDoFooterComponent } from '../todo-footer/todo-footer.component';
import { ToDoInputComponent } from '../todo-input/todo-input.component';
import { ToDoListComponent } from '../todo-list/todo-list.component';
import { ToDo } from '../../models/todo.model';
import { todoService } from '../../services/todo.service';
import './todo-wrap.css';

export class ToDoWrapComponent extends HTMLElement {
  get filter(): string {
    return this.getAttribute('filter') || 'all';
  }

  set filter(state: string) {
    this.setAttribute('filter', state);
  }

  constructor() {
    super();

    this.innerHTML = `
      <div class="backdrop"></div>
      <div class="app-container">
        <div class="app-wrap">
          <div class="header">
            <h1>TODO</h1>
            <a href="javascript:void(0)" id="dark-mode">
              <div class="dark-mode-icon">
              </div>
            </a>
          </div>
          <app-todo-input></app-todo-input>
          <app-todo-list></app-todo-list>
          <app-todo-footer></app-todo-footer>
          <div class="drag-text">Drag and drop to reorder list</div>
        </div>
      </div>
    `;

    const todoList =
      document.querySelector<ToDoListComponent>('app-todo-list')!;
    const todoInput =
      document.querySelector<ToDoInputComponent>('app-todo-input')!;
    const todoFooter =
      document.querySelector<ToDoFooterComponent>('app-todo-footer')!;

    todoService.getToDos().then((toDos: ToDo[]) => {
      toDos.forEach((todo) => {
        todoList.addTodo(todo);
      });
    });

    todoInput.addEventListener(appConfig.events.newTodo, (e) => {
      const customEvent = e as CustomEvent;
      const todo = JSON.parse(customEvent.detail);
      todoList.addTodo(todo);
    });

    todoList.addEventListener(appConfig.events.itemsLeft, (e) => {
      const customEvent = e as CustomEvent;
      todoFooter.itemsLeft = Number(customEvent.detail);
    });

    todoFooter.addEventListener(appConfig.events.clearCompleted, () => {
      todoList.removeCompletedToDos();
    });

    todoFooter.addEventListener(appConfig.events.newFilter, (e) => {
      const customEvent = e as CustomEvent;
      this.filter = customEvent.detail;
    });

    const darkModeEl = document.querySelector(
      '#dark-mode'
    ) as HTMLAnchorElement;
    darkModeEl.onclick = () => {
      const currenTheme = document.body.getAttribute('data-theme');
      const newTheme = currenTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem(appConfig.storage.darkMode, newTheme);
      document.body.setAttribute('data-theme', newTheme);
    };
  }
}
