import G6 from '@antv/g6/lib';

export default {
  install ({ graph, options }) {
    const minimap = new G6.Minimap({
      size: [160, 80],
      ...options
    });

    graph.addPlugin(minimap);
    graph.refresh();
  }
};
