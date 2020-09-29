import defaultGraph from './default-graph';
import defaultNode from './default-node';
import defaultEdge from './default-edge';

export default {
  ...defaultGraph,
  ...defaultNode,
  ...defaultEdge
};

export { 
  defaultGraph,
  defaultNode,
  defaultEdge
};
