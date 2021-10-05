import { CreateToDo, ToDo } from '../../models/todo.model';
import { todoService } from '../../services/todo.service';
import { ToDoInputComponent } from './todo-input.component';

jest.mock('../../services/todo.service');

const mockedTodoService = todoService as jest.Mocked<typeof todoService>;

window.customElements.define('app-todo-input', ToDoInputComponent);
document.body.innerHTML = `<app-todo-input></app-todo-input>`;
const mockedToDoInputComponent =
  document.querySelector<ToDoInputComponent>('app-todo-input')!;

describe('ToDoInputComponent', () => {
  beforeEach(() => {
    mockedToDoInputComponent.dispatchEvent = jest.fn();
  });

  it('should load as a custom web component', () => {
    expect(document.querySelector('#todo-input')).toBeDefined();
    expect(document.querySelector('#text-input')).toBeDefined();
  });

  it('should add a ToDo Element', async () => {
    const newTask = 'make sure to unit-test your code';
    mockedTodoService.createToDo.mockReturnValue(
      Promise.resolve(mockToDo(newTask))
    );

    const input = document.querySelector('#text-input') as HTMLInputElement;
    input.value = newTask;
    await input.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }));

    expect(mockedTodoService.createToDo).toHaveBeenCalledWith(
      mockCreateToDo(newTask)
    );

    expect(mockedToDoInputComponent.dispatchEvent).toHaveBeenCalledWith(
      new CustomEvent('newTodo', {
        bubbles: true,
        composed: true,
        detail: JSON.stringify(mockToDo(newTask)),
      })
    );
  });
});

function mockToDo(description: string): ToDo {
  return {
    _id: '1',
    description,
    order: 3,
    completed: false,
  };
}

function mockCreateToDo(description: string): CreateToDo {
  return {
    description,
  };
}
