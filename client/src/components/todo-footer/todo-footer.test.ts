import { ToDoFooterComponent } from './todo-footer.component';

jest.mock('../../services/todo.service');

window.customElements.define('app-todo-footer', ToDoFooterComponent);
document.body.innerHTML = `<app-todo-footer></app-todo-footer>`;
const mockedToDoFooterComponent =
  document.querySelector<ToDoFooterComponent>('app-todo-footer')!;

describe('ToDoFooterComponent', () => {
  it('should load as a custom web component', () => {
    expect(document.querySelector('#todo-footer-container')).toBeDefined();
    expect(document.querySelector('#count')).toBeDefined();
    expect(document.querySelector('#filters')).toBeDefined();
    expect(document.querySelector('#filter-all')).toBeDefined();
    expect(document.querySelector('#filter-active')).toBeDefined();
    expect(document.querySelector('#filter-completed')).toBeDefined();
    expect(document.querySelector('#clear')).toBeDefined();
  });

  beforeEach(() => {
    mockedToDoFooterComponent.dispatchEvent = jest.fn();
  });

  it('should fire a filter all event', () => {
    const filterAll = document.querySelector(
      '.filter-all'
    ) as HTMLAnchorElement;
    filterAll.click();
    expect(mockedToDoFooterComponent.dispatchEvent).toHaveBeenCalledWith(
      mockCustomEvent('newFilter', 'all')
    );
  });

  it('should fire a filter active event', () => {
    const filterActive = document.querySelector(
      '.filter-active'
    ) as HTMLAnchorElement;
    filterActive.click();
    expect(mockedToDoFooterComponent.dispatchEvent).toHaveBeenCalledWith(
      mockCustomEvent('newFilter', 'active')
    );
  });

  it('should fire a filter completed event', () => {
    const filterCompleted = document.querySelector(
      '.filter-completed'
    ) as HTMLAnchorElement;
    filterCompleted.click();
    expect(mockedToDoFooterComponent.dispatchEvent).toHaveBeenCalledWith(
      mockCustomEvent('newFilter', 'completed')
    );
  });

  it('should fire a clear completed event', () => {
    const clearCompleted = document.querySelector(
      '#clear-button'
    ) as HTMLAnchorElement;
    clearCompleted.click();
    expect(mockedToDoFooterComponent.dispatchEvent).toHaveBeenCalledWith(
      new Event('clearCompleted')
    );
  });
});

function mockCustomEvent(filterName: string, filter: string): CustomEvent {
  return new CustomEvent(filterName, {
    bubbles: true,
    composed: true,
    detail: filter,
  });
}
