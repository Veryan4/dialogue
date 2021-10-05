import { appConfig } from '../../app.config';
import { CreateToDo } from '../../models/todo.model';
import { todoService } from '../../services/todo.service';
import './todo-input.css';

export class ToDoInputComponent extends HTMLElement {
  constructor() {
    super();

    this.innerHTML = `
    <div id="todo-input">
      <div class="circle">
        <div class="inner-circle"></div>
      </div>
      <input id="text-input" type="text" placeholder="Create a new todo..." />
    </div>`;

    const input = document.querySelector('#text-input') as HTMLInputElement;
    if (input)
      input.addEventListener('keypress', (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          const createTodo: CreateToDo = {
            description: input.value,
          };
          todoService.createToDo(createTodo).then((todo) => {
            input.value = '';
            this.dispatchEvent(
              new CustomEvent(appConfig.events.newTodo, {
                bubbles: true,
                composed: true,
                detail: JSON.stringify(todo),
              })
            );
          });
        }
      });
  }
}
