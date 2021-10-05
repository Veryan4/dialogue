import { appConfig } from './app.config';
import { ToDoFooterComponent } from './components/todo-footer/todo-footer.component';
import { ToDoInputComponent } from './components/todo-input/todo-input.component';
import { ToDoListComponent } from './components/todo-list/todo-list.component';
import { ToDoWrapComponent } from './components/todo-wrap/todo-wrap.component';
import './style.css';

window.customElements.define('app-todo-list', ToDoListComponent);
window.customElements.define('app-todo-input', ToDoInputComponent);
window.customElements.define('app-todo-footer', ToDoFooterComponent);
window.customElements.define('app-todo-wrap', ToDoWrapComponent);

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `<app-todo-wrap filter="all"></app-todo-wrap>`;

const darkMode = localStorage.getItem(appConfig.storage.darkMode);
if (darkMode) document.body.setAttribute('data-theme', darkMode);
