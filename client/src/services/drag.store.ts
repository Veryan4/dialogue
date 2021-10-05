let dragNodeStore: Node | null;

function setDragNode(newNode: Node | null): void {
  dragNodeStore = newNode;
}

function getDragNode(): Node | null {
  return dragNodeStore;
}

export { setDragNode, getDragNode };
