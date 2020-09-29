import G6 from '@antv/g6/lib';

export default {
  install ({ graph, options }) {
    const grid = new G6.Grid(options);
      
    graph.addPlugin(grid);
    graph.refresh();
  }
};
