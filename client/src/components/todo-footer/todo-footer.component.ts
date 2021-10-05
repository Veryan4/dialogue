import { appConfig } from '../../app.config';
import './todo-footer.css';

export class ToDoFooterComponent extends HTMLElement {
  get itemsLeft(): number {
    return Number(this.getAttribute('items-left')) || 0;
  }

  set itemsLeft(itemCount: number) {
    this.setAttribute('items-left', itemCount.toString());
    const count = document.querySelector('#count')!;
    count.innerHTML = `${itemCount} items left`;
  }

  constructor() {
    super();

    this.innerHTML = `
    <div id="todo-footer-container">
      <div id="count">${this.itemsLeft} items left</div>
      <div id="filters">
        <div class="filters-wrap"></div>
      </div>
      <div id="clear"></div>
    </div>
    <div id="todo-footer-mobile-container">
      <div class="filters-wrap"></div>
    </div>`;

    this.createFilters();
    this.createClearCompletedButton();
  }

  private createFilters(): void {
    const filterEls = document.querySelectorAll('.filters-wrap');
    filterEls.forEach((filtersEl) => {
      this.createSingleFilter(filtersEl, 'All');
      this.createSingleFilter(filtersEl, 'Active');
      this.createSingleFilter(filtersEl, 'Completed');
    });
  }

  private createSingleFilter(filtersEl: Element, filterType: string) {
    const buttonEl = document.createElement('a');
    buttonEl.className = 'filter-' + filterType.toLowerCase();
    buttonEl.href = 'javascript:void(0)';
    buttonEl.onclick = () => {
      this.dispatchFilter(filterType.toLowerCase());
    };
    buttonEl.innerText = filterType;
    filtersEl.appendChild(buttonEl);
  }

  private createClearCompletedButton(): void {
    const clearEl = document.querySelector('#clear')!;
    const buttonEl = document.createElement('a');
    buttonEl.id = 'clear-button';
    buttonEl.href = 'javascript:void(0)';
    buttonEl.onclick = () => {
      this.dispatchClearCompleted();
    };
    buttonEl.innerText = 'Clear completed';
    clearEl.appendChild(buttonEl);
  }

  private dispatchClearCompleted(): void {
    this.dispatchEvent(new Event(appConfig.events.clearCompleted));
  }

  private dispatchFilter(filter: string): void {
    this.dispatchEvent(
      new CustomEvent(appConfig.events.newFilter, {
        bubbles: true,
        composed: true,
        detail: filter,
      })
    );
  }
}
