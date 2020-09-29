import G6 from '@antv/g6/lib';
import { FLOWCHART_MODE } from '../constants';

G6.registerEdge('flow-edge', {
  draw(cfg, group) {
    const startPoint = cfg.startPoint;
    const endPoint = cfg.endPoint;
    const style = cfg.style;
    const nodeGroup = cfg.targetNode.getContainer();
    const nodeShape = nodeGroup.get('children')[0];
    const shape = group.addShape('path', {
      attrs: {
        ...style,
        path: [
          ['M', startPoint.x, startPoint.y],
          ['L', endPoint.x / 3 + (2 / 3) * startPoint.x, startPoint.y], // 三分之一处
          ['L', endPoint.x / 3 + (2 / 3) * startPoint.x, endPoint.y], // 三分之二处
          ['L', endPoint.x, endPoint.y],
        ],
      },
      // must be assigned in G6 3.3 and later versions. it can be any value you want
      name: 'path-shape',
    });

    // 画箭头
    const { mode } = nodeShape.attrs;
    const marker = nodeGroup.addShape('marker', {
      attrs: {
        ...style,
        x: 20,
        y: 20,
        r: 6,
        fill: style.stroke,
        symbol (x, y, r) {
          let offset = 0;
          if (mode === FLOWCHART_MODE.EDIT) {
            offset = style.arrowOffset;
          }
          return [['M', x - offset, y], ['L', -r - offset, y - r * .5], ['L', -r - offset, y + r * .5], ['Z']];
        }
      }
    });

    marker.toFront();
    return shape;
  },
}, 'polyline');
