import G6 from '@antv/g6/lib';
import { get } from 'lodash';
import events from '../events';
import { NODE_SIZE } from '../constants';

G6.registerBehavior('drag-add-node', {
  getEvents() {
    return {
      'canvas:drop': 'onDrop',
    };
  },
  onDrop (ev) {
    const dataTransfer = get(ev, 'originalEvent.dataTransfer');
    const { graph } = this;
    if (dataTransfer) {
      const nodeCfgString = dataTransfer.getData('text/plain');
      if (nodeCfgString) {
        // 增加节点
        const nodeCfg = JSON.parse(nodeCfgString);
        const [width, height] = NODE_SIZE;
        const point = { x: ev.x - width / 2, y: ev.y - height / 2 };

        graph.addItem('node', {
          ...nodeCfg,
          ...point,
          size: NODE_SIZE
        });

        // 选中已添加节点
        events.emit('item-state-clear');
      }
    }
  }

});
