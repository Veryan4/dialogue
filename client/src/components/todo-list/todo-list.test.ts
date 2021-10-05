import { ToDo } from '../../models/todo.model';
import { todoService } from '../../services/todo.service';
import { ToDoListComponent } from './todo-list.component';

jest.mock('../../services/todo.service');

const mockedTodoService = todoService as jest.Mocked<typeof todoService>;

window.customElements.define('app-todo-list', ToDoListComponent);
document.body.innerHTML = `<app-todo-list></app-todo-list>`;
const mockedToDoListComponent =
  document.querySelector<ToDoListComponent>('app-todo-list')!;

describe('ToDoListComponent', () => {
  beforeEach(() => {
    mockedToDoListComponent.dispatchEvent = jest.fn();
    mockedToDoListComponent.itemsLeft = 0;
  });

  it('should load as a custom web component', () => {
    expect(document.querySelector('#todo-list-container')).toBeTruthy();
  });

  it('should add a ToDo Element', async () => {
    await mockedToDoListComponent.addTodo(mockToDo('1'));
    expect(mockedToDoListComponent.itemsLeft).toBe(1);
    expect(mockedToDoListComponent.dispatchEvent).toHaveBeenCalledWith(
      mockItemsLeftEvent(1)
    );
    expect(document.querySelector('#todo-list-container')).toBeTruthy();
    const toDoWrap = document.querySelector('.todo-wrap');
    expect(toDoWrap).toBeTruthy();
    expect(toDoWrap?.getAttribute('todo')).toBe(JSON.stringify(mockToDo('1')));
    expect(toDoWrap?.getAttribute('todo-id')).toBe('1');
    expect(toDoWrap?.getAttribute('completed')).toBe('false');
    expect(document.querySelector('.check')).toBeTruthy();
    expect(document.querySelector('.description')).toBeTruthy();
    expect(document.querySelector('.cross')).toBeTruthy();
  });

  it('should remove completed ToDo Elements', async () => {
    await mockedToDoListComponent.addTodo(mockToDo('2', true));
    expect(mockedToDoListComponent.itemsLeft).toBe(0);
    expect(mockedToDoListComponent.dispatchEvent).toHaveBeenCalledWith(
      mockItemsLeftEvent(1)
    );
    expect(document.querySelectorAll('.todo-wrap').length).toBe(2);
    expect(document.querySelectorAll("[completed='true']").length).toBe(1);
    mockedTodoService.clearCompletedToDos.mockReturnValue(
      Promise.resolve({ deletedCount: 1 })
    );
    await mockedToDoListComponent.removeCompletedToDos();
    expect(mockedToDoListComponent.itemsLeft).toBe(0);
    expect(document.querySelectorAll('.todo-wrap').length).toBe(1);
    expect(document.querySelectorAll("[completed='true']").length).toBe(0);
    expect(mockedTodoService.clearCompletedToDos).toHaveBeenCalled();
  });

  it('should toggle completed of ToDo elements', async () => {
    await mockedToDoListComponent.addTodo(mockToDo('3'));
    expect(mockedToDoListComponent.itemsLeft).toBe(1);
    expect(mockedToDoListComponent.dispatchEvent).toHaveBeenCalledWith(
      mockItemsLeftEvent(2)
    );
    expect(document.querySelectorAll("[completed='true']").length).toBe(0);
    mockedTodoService.updateToDos.mockReturnValue(
      Promise.resolve([mockToDo('3', true)])
    );
    await mockedToDoListComponent.toggleCompleted(mockToDo('3'));
    expect(mockedTodoService.updateToDos).toHaveBeenCalledWith([
      mockToDo('3', true),
    ]);
    expect(mockedToDoListComponent.itemsLeft).toBe(0);
    expect(mockedToDoListComponent.dispatchEvent).toHaveBeenCalledWith(
      mockItemsLeftEvent(0)
    );
    expect(document.querySelectorAll("[completed='true']").length).toBe(1);
    await mockedToDoListComponent.toggleCompleted(mockToDo('3', true));
    expect(mockedTodoService.updateToDos).toHaveBeenCalledWith([mockToDo('3')]);
    expect(mockedToDoListComponent.itemsLeft).toBe(1);
    expect(mockedToDoListComponent.dispatchEvent).toHaveBeenCalledWith(
      mockItemsLeftEvent(1)
    );
    expect(document.querySelectorAll("[completed='true']").length).toBe(0);
  });

  it('should remove a specific todo', async () => {
    mockedTodoService.removeAToDo.mockReturnValue(
      Promise.resolve({ deleted: '4' })
    );
    await mockedToDoListComponent.addTodo(mockToDo('4'));
    await mockedToDoListComponent.addTodo(mockToDo('5', true));
    expect(mockedToDoListComponent.itemsLeft).toBe(1);
    expect(mockedToDoListComponent.dispatchEvent).toHaveBeenCalledWith(
      mockItemsLeftEvent(1)
    );
    expect(document.querySelectorAll("[todo-id='4']").length).toBe(1);
    expect(document.querySelectorAll("[todo-id='5']").length).toBe(1);
    await mockedToDoListComponent.removeSpecificToDo('5');
    expect(mockedTodoService.removeAToDo).toHaveBeenCalledWith('5');
    expect(mockedToDoListComponent.itemsLeft).toBe(1);
    expect(document.querySelectorAll("[todo-id='4']").length).toBe(1);
    expect(document.querySelectorAll("[todo-id='5']").length).toBe(0);
    await mockedToDoListComponent.removeSpecificToDo('4');
    expect(mockedTodoService.removeAToDo).toHaveBeenCalledWith('4');
    expect(mockedToDoListComponent.itemsLeft).toBe(0);
    expect(mockedToDoListComponent.dispatchEvent).toHaveBeenCalledWith(
      mockItemsLeftEvent(0)
    );
    expect(document.querySelectorAll("[todo-id='4']").length).toBe(0);
  });
});

function mockToDo(_id: string, completed = false): ToDo {
  return {
    _id,
    description: 'write unit tests',
    order: 3,
    completed,
  };
}

function mockItemsLeftEvent(itemsLeft: number): CustomEvent {
  return new CustomEvent('itemsLeft', {
    bubbles: true,
    composed: true,
    detail: itemsLeft,
  });
}
