import { appConfig } from '../../app.config';
import { ToDo } from '../../models/todo.model';
import { getDragNode, setDragNode } from '../../services/drag.store';
import { todoService } from '../../services/todo.service';
import './todo-list.css';

export class ToDoListComponent extends HTMLElement {
  get itemsLeft(): number {
    return Number(this.getAttribute('items-left')) || 0;
  }

  set itemsLeft(count: number) {
    this.setAttribute('items-left', count.toString());
  }

  constructor() {
    super();

    this.innerHTML = `<div id="todo-list-container"></div>`;

    // Prevents ugly animation after drag & drop
    document.addEventListener('dragover', function (e) {
      e.preventDefault();
    });
  }

  addTodo(todo: ToDo): void {
    const todoEl = document.createElement('div');
    todoEl.className = 'todo-wrap';
    todoEl.setAttribute('todo-id', todo._id);
    todoEl.setAttribute('completed', todo.completed.toString());
    todoEl.setAttribute('todo', JSON.stringify(todo));

    this.createCompleteCheckEl(todoEl, todo);
    this.createDescriptionEl(todoEl, todo);
    this.createRemoveToDoEl(todoEl, todo);

    todoEl.ondragend = (e) => this.dragEnd(e)!;
    todoEl.ondragstart = (e) => this.dragStart(e)!;
    todoEl.ondragover = (e) => this.dragOver(e)!;

    const todoListEl = document.querySelector('#todo-list-container')!;
    if (todoListEl) {
      todoListEl.appendChild(todoEl);
      if (!todo.completed) this.itemsLeft++;
      this.dispatchItemsLeft();
    }
  }

  private createCompleteCheckEl(todoEl: HTMLElement, todo: ToDo): void {
    const checkEl = document.createElement('div');
    checkEl.className = 'check';
    checkEl.onclick = () => {
      this.toggleCompleted(todo);
    };
    checkEl.innerHTML = `
    <div class="inner-circle">
      <img class="check-image" src="./icon-check.svg" alt="check" />
    </div>`;
    todoEl.appendChild(checkEl);
  }

  private createDescriptionEl(todoEl: HTMLElement, todo: ToDo): void {
    const descriptionEl = document.createElement('div');
    descriptionEl.className = 'description';
    descriptionEl.innerHTML = todo.description;

    descriptionEl.onmousedown = (e) => {
      const target = e!.target as HTMLElement;
      target.parentElement!.setAttribute('draggable', 'true');
    };
    descriptionEl.onmouseup = (e) => {
      const target = e!.target as HTMLElement;
      target.parentElement!.setAttribute('draggable', 'false');
    };

    todoEl.appendChild(descriptionEl);
  }

  private createRemoveToDoEl(todoEl: HTMLElement, todo: ToDo): void {
    const crossEl = document.createElement('div');
    crossEl.className = 'cross';
    crossEl.onclick = () => {
      this.removeSpecificToDo(todo._id);
    };
    crossEl.innerHTML = `<img class="cross-image" src="./icon-cross.svg" alt="cross" />`;
    todoEl.appendChild(crossEl);
  }

  removeCompletedToDos(): void {
    todoService.clearCompletedToDos().then(() => {
      document.querySelectorAll("[completed='true']").forEach((e) => {
        const isCompleted = e.getAttribute('completed') === 'true';
        if (!isCompleted) this.itemsLeft--;
        e.parentElement!.removeChild(e);
      });
      this.dispatchItemsLeft();
    });
  }

  toggleCompleted(todo: ToDo): void {
    todo.completed = !todo.completed;
    todoService.updateToDos([todo]).then(() => {
      const todoEl = document.querySelector(`[todo-id='${todo._id}']`);
      todoEl?.setAttribute('completed', todo.completed.toString());
      todo.completed ? this.itemsLeft-- : this.itemsLeft++;
      this.dispatchItemsLeft();
    });
  }

  removeSpecificToDo(todoId: string): void {
    todoService.removeAToDo(todoId).then(() => {
      document.querySelectorAll(`[todo-id='${todoId}']`).forEach((e) => {
        if (e.parentElement) {
          const isCompleted = e.getAttribute('completed') === 'true';
          if (!isCompleted) this.itemsLeft--;
          e.parentElement.removeChild(e);
        }
      });
      this.dispatchItemsLeft();
    });
  }

  private dispatchItemsLeft(): void {
    this.dispatchEvent(
      new CustomEvent(appConfig.events.itemsLeft, {
        bubbles: true,
        composed: true,
        detail: this.itemsLeft,
      })
    );
  }

  private dragOver(e: Event): void {
    const target = e.target as Element;
    const selected = getDragNode();
    if (
      selected &&
      this.isNodeBefore(selected, target.parentNode!) &&
      target.parentNode &&
      target.parentNode.parentNode
    ) {
      target.parentNode.parentNode.insertBefore(selected, target.parentNode);
    } else if (selected && target.parentNode && target.parentNode.parentNode) {
      target.parentNode.parentNode.insertBefore(
        selected,
        target.parentNode.nextSibling
      );
    }
  }

  private dragEnd(e: DragEvent): void {
    if (e) {
      const target = e.target as HTMLElement;
      target.setAttribute('draggable', 'false');
    }
    setDragNode(null);
    this.reOrderToDos();
  }

  private reOrderToDos(): void {
    const toDos: ToDo[] = [];
    document.querySelectorAll('.todo-wrap').forEach((el: Element, i) => {
      const todo = JSON.parse(el.getAttribute('todo')!);
      todo.order = i;
      toDos.push(todo);
    });
    todoService.updateToDos(toDos);
  }

  private dragStart(e: DragEvent): void {
    if (e && e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', '');
      const target = e.target as Node;
      setDragNode(target);
    }
  }

  private isNodeBefore(el1: Node, el2: Node): boolean {
    let cur;
    if (el2.parentNode === el1.parentNode) {
      for (cur = el1.previousSibling; cur; cur = cur.previousSibling) {
        if (cur === el2) return true;
      }
    }
    return false;
  }
}
