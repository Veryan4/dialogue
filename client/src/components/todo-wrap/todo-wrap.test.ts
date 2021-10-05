import { ToDo } from '../../models/todo.model';
import { todoService } from '../../services/todo.service';
import { ToDoFooterComponent } from '../todo-footer/todo-footer.component';
import { ToDoInputComponent } from '../todo-input/todo-input.component';
import { ToDoListComponent } from '../todo-list/todo-list.component';
import { ToDoWrapComponent } from './todo-wrap.component';

jest.mock('../../services/todo.service');

const mockedTodoService = todoService as jest.Mocked<typeof todoService>;
mockedTodoService.getToDos.mockReturnValue(Promise.resolve([mockToDo('1')]));

window.customElements.define('app-todo-wrap', ToDoWrapComponent);
document.body.innerHTML = `<app-todo-wrap></app-todo-wrap>`;

const mockedTodoListComponent =
  document.querySelector<ToDoListComponent>('app-todo-list')!;
const mockedTodoInputComponent =
  document.querySelector<ToDoInputComponent>('app-todo-input')!;
const mockedTodoFooterComponent =
  document.querySelector<ToDoFooterComponent>('app-todo-footer')!;
const mockedToDoWrapComponent =
  document.querySelector<ToDoWrapComponent>('app-todo-wrap')!;

describe('ToDoWrapComponent', () => {
  beforeEach(() => {
    mockedToDoWrapComponent.dispatchEvent = jest.fn();
  });

  it('should load as a custom web component', () => {
    expect(mockedTodoListComponent).toBeTruthy();
    expect(mockedTodoInputComponent).toBeTruthy();
    expect(mockedTodoFooterComponent).toBeTruthy();
    expect(mockedTodoService.getToDos).toHaveBeenCalled();
  });

  it('should pass the new todo', async () => {
    mockedTodoListComponent.addTodo = jest.fn();
    await mockedTodoInputComponent.dispatchEvent(
      mockCustomEvent('newTodo', JSON.stringify(mockToDo('1')))
    );
    expect(mockedTodoListComponent.addTodo).toHaveBeenCalledWith(mockToDo('1'));
  });

  it('should pass the items left', async () => {
    await mockedTodoListComponent.dispatchEvent(
      mockCustomEvent('itemsLeft', '1')
    );
    expect(mockedTodoFooterComponent.itemsLeft).toBe(1);
  });

  it('should pass the command for clearing the completed tasks', async () => {
    mockedTodoListComponent.removeCompletedToDos = jest.fn();
    await mockedTodoFooterComponent.dispatchEvent(new Event('clearCompleted'));
    expect(mockedTodoListComponent.removeCompletedToDos).toHaveBeenCalled();
  });

  it('should pass the items filter', async () => {
    await mockedTodoFooterComponent.dispatchEvent(
      mockCustomEvent('newFilter', 'active')
    );
    expect(mockedToDoWrapComponent.getAttribute('filter')).toBe('active');
  });
});

function mockToDo(_id: string): ToDo {
  return {
    _id,
    description: 'make sure to unit-test your code',
    order: 3,
    completed: false,
  };
}

function mockCustomEvent(eventName: string, detail: string): CustomEvent {
  return new CustomEvent(eventName, {
    bubbles: true,
    composed: true,
    detail,
  });
}
