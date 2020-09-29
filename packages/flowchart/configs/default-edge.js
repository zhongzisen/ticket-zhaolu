import { ITEM_STATE, STYLES } from '../constants';

const defaultEdge = {
  defaultEdge: {
    type: 'polyline',
    style: {
      offset: STYLES.LINE_OFFSET,  // 拐弯处距离节点最小距离
      radius: STYLES.LINE_RADIUS,  // 拐弯处的圆角弧度，若不设置则为直角
      lineWidth: STYLES.LINE_WIDTH,
      lineAppendWidth: STYLES.LINE_APPEND_WIDTH,
      stroke: STYLES.LINE_COLOR,
      endArrow: true
    }
  },
  edgeStateStyles: {
    [ITEM_STATE.ACTIVATED]: {
      stroke: STYLES.MAIN_COLOR
    },
    [ITEM_STATE.SELECTED]: {
      lineWidth: STYLES.LINE_WIDTH_SELECTED,
      stroke: STYLES.MAIN_COLOR
    }
  }
};

export default defaultEdge;
