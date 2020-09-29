import G6 from '@antv/g6/lib';
import { uniqueId, get } from 'lodash';
import { STYLES, FLOWCHART_MODE, NODE_TYPE, NODE_ANCHOR_POINTS, NODE_ANCHOR_TYPE, NODE_ANCHOR_INDEX } from '../constants';

const anchorStyle = {
  r: STYLES.ANCHOR_RADIUS,
  fill: STYLES.WHITE_COLOR,
  stroke: STYLES.MAIN_COLOR,
  lineAppendWidth: STYLES.LINE_APPEND_WIDTH,
  lineWidth: STYLES.ANCHOR_LINE_WIDTH,
};

const getNodeHtml = (cfg, states = '') => {
  return `
    <div class="flowchart-node ${states}" style="width: ${cfg.size[0]}px; height: ${cfg.size[1]}px;">
      <span>${cfg.name}</span>
    </div>`;
};

G6.registerNode('flow-node', {
  draw: (cfg, group) => {
    const width = parseInt(cfg.size[0]);
    const height = parseInt(cfg.size[1]);
    const nodeId = cfg.id || 'node-' + uniqueId();
    const mode = get(cfg, 'mode', FLOWCHART_MODE.EDIT);

    const shape = group.addShape('dom', {
      id: nodeId,
      attrs: {
        width,
        height,
        mode,
        // 传入 DOM 的 html
        html: getNodeHtml(cfg)
      },
      draggable: true
    });

    group.addShape('rect', {
      nodeId: nodeId,
      attrs: {
        width,
        height,
        fill: 'transparent',
        cursor: 'move'
      },
      draggable: true,
    });

    // 绘制锚点
    if (mode === FLOWCHART_MODE.EDIT) {
      NODE_ANCHOR_POINTS.forEach((point, index) => {

        const [ratioX, ratioY] = point;
        const anchorType = index === NODE_ANCHOR_INDEX[NODE_ANCHOR_TYPE.IN] ? NODE_ANCHOR_TYPE.IN : NODE_ANCHOR_TYPE.OUT;
        const anchor = group.addShape('circle', {
          name: 'flow-anchor',
          id: 'anchor-' + uniqueId(),
          anchorType,
          nodeId,
          index,
          attrs: {
            x: width * ratioX,
            y: height * ratioY,
            ...anchorStyle,
            cursor: 'crosshair',
            index: 9999
          }
        });

        if (anchorType === NODE_ANCHOR_TYPE.IN && cfg.nodeType === NODE_TYPE.START) {
        // 开始节点，隐藏左侧锚点
          anchor.hide();
        } else if (anchorType === NODE_ANCHOR_TYPE.OUT && cfg.nodeType === NODE_TYPE.END) {
        // 结束节点，隐藏右侧锚点
          anchor.hide();
        }

      });
    }
    group.toBack();
    return shape;
  },
  // 处理状态变更
  setState(state, value, item) {
    const group = item.getContainer();
    const shape = group.get('children')[0]; // 顺序根据 draw 时确定
    const cfg = item.get('model');

    const states = item.getStates();
    shape.attr('html', getNodeHtml(cfg, states.join(' ')));
  },
  getAnchorPoints () {
    return NODE_ANCHOR_POINTS;
  }
}, 'single-node');
