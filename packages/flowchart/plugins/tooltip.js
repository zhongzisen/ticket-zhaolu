import G6 from '@antv/g6/lib';

export default {
  install ({ graph, options }) {
    const tooltip = new G6.Tooltip({
      offsetX: 10,
      offsetY: 20,
      itemTypes: ['node', 'edge', 'combo'],
      ...options
    });
      
    graph.addPlugin(tooltip);
    graph.refresh();
  }
};
