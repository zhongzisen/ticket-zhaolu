export const NODE_SIZE = [120, 40];

export const NODE_ANCHOR_POINTS = [[0, 0.5], [1, 0.5]];

export const NODE_ANCHOR_TYPE = {
  IN: 'in',
  OUT: 'out',
};

export const NODE_ANCHOR_INDEX = {
  [NODE_ANCHOR_TYPE.IN]: 0,
  [NODE_ANCHOR_TYPE.OUT]: 1,
};

export const FLOWCHART_MODE = {
  // 只读
  READONLY: 'readonly',
	
  // 编辑
  EDIT: 'edit'
};

export const ITEM_TYPE = {
  NODE: 'node',
  EDGE: 'edge'
};

export const NODE_TYPE = {
  // 开始节点
  START: 'start',

  // 结束节点
  END: 'end',
  
  // 正常
  NORMAL: 'normal',
};

export const ITEM_STATE = {
  SELECTED: 'selected',
  ACTIVATED: 'activated'
};

// export const ERROR_CODES = {
//   100001: 'The node type should be start, end, normal',
//   100002: 'Start node already exists',
//   100003: 'End node already exists',
// };

export const ERROR_CODES = {
  100001: '节点类型只能为：开始、结束、正常',
  100002: '当前已存在开始节点',
  100003: '当前已存在结束节点',
};

// 样式颜色配置
export const STYLES = {
  WHITE_COLOR: '#FFFFFF',
  MAIN_COLOR: '#0044CC',
  MAIN_COLOR_HOVER: '#0055FF',

  ANCHOR_LINE_WIDTH: 1.5,
  ANCHOR_RADIUS: 3,


  LINE_COLOR: '#666666',
  LINE_WIDTH: 1,
  LINE_WIDTH_SELECTED: 1.5,
  LINE_APPEND_WIDTH: 5,
  LINE_RADIUS: 5,
  LINE_OFFSET: 30,
};
