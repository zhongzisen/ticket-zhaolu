import { cloneDeep, isString } from 'lodash';
/**
 * undo 操作
 */
export const handleUndo = (graph) => {
  const undoStack = graph.getUndoStack();
  if (!undoStack || undoStack.length === 0) {
    return;
  }

  const currentData = undoStack.pop();
  if (currentData) {
    let { action, data } = currentData;
    graph.pushStack(action, cloneDeep(data), 'redo');

    if (undoStack.length > 0) {
      const current = undoStack.peek();
      action = current.action;
      data = current.data;
    }

    switch (action) {
      case 'visible': {
        let item = data;
        if (isString(data)) {
          item = graph.findById(data);
        }
        if (item.get('visible')) {
          graph.hideItem(item, false);
        } else {
          graph.showItem(item, false);
        }
        break;
      }
      case 'render':
      case 'update':
        changeData(graph, data);
        break;
      case 'delete': {
        const { type, ...model } = data;
        const item = graph.addItem(type, model, false);
        if (type === 'edge') item.toBack();
        break;
      }
      case 'add':
        graph.removeItem(data.id, false);
        break;
      default:
    }
  }
};

/**
 * redo 操作
 */
export const handleRedo = (graph) => {
  const redoStack = graph.getRedoStack();

  if (!redoStack || redoStack.length === 0) {
    return;
  }

  let currentData = redoStack.pop();
  if (currentData) {
    let { action, data } = currentData;
    graph.pushStack(action, cloneDeep(data));
    if (action === 'render') {
      currentData = redoStack.pop();
      action = currentData.action;
      data = currentData.data;
      graph.pushStack(action, cloneDeep(data));
    }

    switch (action) {
      case 'visible': {
        let item = data;
        if (isString(data)) {
          item = graph.findById(data);
        }
        if (item.get('visible')) {
          graph.hideItem(item, false);
        } else {
          graph.showItem(item, false);
        }
        break;
      }
      case 'render':
      case 'update':
        changeData(graph, data);
        break;
      case 'delete':
        graph.removeItem(data.id, false);
        break;
      case 'add': {
        const { type, ...model } = data;
        graph.addItem(type, model, false);
        break;
      }
      default:
    }
  }
};

const changeData = (graph, data) => {
  Object.keys(data).forEach(key => {
    if (data[key].length > 0) {
      data[key].forEach(item => {
        const currentItem = graph.findById(item.id);
        if (currentItem) graph.updateItem(currentItem, item, false);
      });
    }
  });
};

export default class Commander {
  graph = null;

  get height () {
    return this.graph.getHeight();
  }

  get currentZoom () {
    return this.graph.getZoom();
  }

  constructor (graph) {
    this.graph = graph;
  }

  undo () {
    handleUndo(this.graph);
  }
  redo () {
    handleRedo(this.graph);
  }

  zoomIn () {
    const { graph } = this;
    const ratioIn = 1 - 0.05 * 5;
    if (ratioIn * this.currentZoom < 0.3) {
      return;
    }
    graph.zoomTo(this.currentZoom * 0.9, {
      x: 0,
      y: this.height / 2
    });
  }

  zoomOut () {
    const { graph } = this;
    const ratioOut = 1 + 0.05 * 5;
    if (ratioOut * this.currentZoom > 5) {
      return;
    }
    graph.zoomTo(this.currentZoom * 1.1, {
      x: 0,
      y: this.height / 2
    });
  }

  autoZoom () {
    this.graph.fitView();
  }

  resetZoom () {
    this.graph.zoomTo(1, {
      x: 0,
      y: this.height / 2
    });
  }

  autoLayout () {
    this.graph.layout();
    this.autoZoom();
    this.resetZoom();
  }

}
