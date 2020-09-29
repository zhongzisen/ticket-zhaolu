import { FLOWCHART_MODE } from '../constants';

const defaultGraph = {
  fitView: true,
  fitViewPadding: 20,
  enabledStack: true,
  groupByTypes: false,
  renderer: 'svg',
  layout: {
    type: 'dagre',
    rankdir: 'LR',
    nodesep: 15,
    ranksep: 20
  },
  modes: {
    [FLOWCHART_MODE.READONLY]: [
      'drag-canvas'
    ],
    [FLOWCHART_MODE.EDIT]: [
      {
        type: 'drag-node',
      }
    ]
  }
};

export default defaultGraph;
