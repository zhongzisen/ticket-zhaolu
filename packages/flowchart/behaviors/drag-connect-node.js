import G6 from '@antv/g6/lib';
import { STYLES } from '../constants';

// 定义连接两个锚点
G6.registerBehavior('drag-connect-node', {
  getDefaultCfg() {
    return {
      delegateEdgeStyle: {
        stroke: STYLES.MAIN_COLOR,
        lineDash: [4, 4],
        lineWidth: STYLES.LINE_WIDTH
      },
      isAnchor (target) {
        return target.get('name') === 'flow-anchor';
      },
      shouldBegin(anchor) {
        return anchor.get('anchorType') === 'out';
      },
      // 判断是否可以画线, 节点不能是同一个
      shouldEnd(anchor) {
        const { edges = [] } = this.graph.save();

        if (anchor.get('anchorType') !== 'in') return false;

        // 判断两点间是否有相同的连线
        const sameEdge = edges.find((item) => {
          return item.source === this.selectedAnchor.get('nodeId')
          && item.target === anchor.get('nodeId');
        });
        if (sameEdge !== undefined) return false;

        // 相同节点上的连线
        const isSameNode = anchor.get('nodeId') === this.selectedAnchor.get('nodeId');
        if (isSameNode) return false;

        return true;
      }
    };
  },
  getEvents() {
    return {
      'mousedown': 'handleStartAddEdge',
      'mousemove': 'handleUpdateEdge',
      'mouseover': 'handleMouseover',
      'mouseout': 'handleMouseout',
      'mouseup': 'handleStopAddEdge'
    };
  },
  // 鼠标按下
  handleStartAddEdge(ev) {
    if (!this.isAnchor(ev.target)) return;

    const anchor = ev.target;
    const point = { x: ev.x, y: ev.y };
    if (!this.selectedAnchor && this.shouldBegin(anchor)) {
      this.delegateEdge = this.graph.addItem('edge', {
        type: 'line',
        style: this.delegateEdgeStyle,
        source: anchor.get('nodeId'),
        sourceAnchor: anchor.get('index'),
        target: point,
        zIndex: 9
      }, false);
      this.selectedAnchor = anchor;
    }
  },
  // 移动鼠标，跟着画线
  handleUpdateEdge(ev) {
    const point = { x: ev.x, y: ev.y };
    if (this.selectedAnchor && this.delegateEdge) {
      // 增加边的过程中，移动时边跟着移动
      this.graph.updateItem(this.delegateEdge, {
        target: point
      }, false);
    }
  },
  // 设置划过样式
  handleMouseover (ev) {
    if (this.isAnchor(ev.target)) {
      const anchor = ev.target;
      this.setAnchorHover(anchor);
    }
  },
  // 鼠标滑出锚点时清空目标节点id
  handleMouseout(ev) {
    if (!this.isAnchor(ev.target)) return;

    const anchor = ev.target;
    if (!this.selectedAnchor) {
      this.resetAnchor(anchor);
    }
  },
  // 抬起鼠标，结束绘制，如果在锚点则进行连线
  handleStopAddEdge(ev) {
    if (!this.selectedAnchor) return;
    this.resetAnchor(this.selectedAnchor);
    this.graph.removeItem(this.delegateEdge, false);

    if (this.isAnchor(ev.target)) {
      const anchor = ev.target;

      if (this.shouldEnd(anchor)) {
        const newEdge = this.graph.addItem('edge', {
          source: this.selectedAnchor.get('nodeId'),
          sourceAnchor: this.selectedAnchor.get('index'),
          target: anchor.get('nodeId'),
          targetAnchor: anchor.get('index')
        });
        newEdge.toBack();
      }
    }

    this.selectedAnchor = null;
    this.delegateEdge = null;
  },
  clear () {
    if (this.delegateEdge) {
      this.graph.removeItem(this.delegateEdge);
      this.selectedAnchor = null;
      this.delegateEdge = null;
    }
  },
  // 锚点hover样式
  setAnchorHover(anchor) {
    anchor.attr({
      r: STYLES.ANCHOR_RADIUS + 1,
      fill: STYLES.MAIN_COLOR
    });
    this.graph.paint();
  },
  // 锚点样式重置
  resetAnchor(anchor) {
    anchor.attr({
      r: STYLES.ANCHOR_RADIUS,
      fill: STYLES.WHITE_COLOR
    });
    this.graph.paint();
  },
});
