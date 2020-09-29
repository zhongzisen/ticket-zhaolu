import { get } from 'lodash';

export const HEADER_TOKEN_KEY = 'User-Token';
export const HEADER_TICKET_APPID_KEY = 'appId';

export const TICKET_HOST = get(window, '__QENV__.TICKET.HOST');
export const TICKET_APPID = get(window, '__QENV__.TICKET.APPID');

// 节点类型
export const TICKET_NODE_TYPE = {
  //正常审批节点：节点审批角色在模板配置时指定
  NORMAL: 4,
  //动态获取审批人审批节点：节点审批人在提交工单是通过接口获取
  DYNAMIC: 5,
  //指定获取审批人审批节点：节点审批人在上一节点处理通过时指定
  ASSIGN: 6
};

// 节点分类
export const TICKET_NODE_CATEGORY = {
  START: 1,
  END: 2,
  APPROVE: 3,
  INFORM: 4,
  AUTO: 5
};

export const TICKET_NODE_CATEGORY_KEY = {
  START: 'NodeType_START',
  END: 'NodeType_END',
  APPROVE: 'NodeCategory_APPROVE',
  INFORM: 'NodeCategory_INFORM',
  AUTO: 'NodeCategory_AUTO'
};

export const TICKET_NODE_CATEGORY_NAME = {
  [TICKET_NODE_CATEGORY.START]: '开始节点',
  [TICKET_NODE_CATEGORY.END]: '结束节点',
  [TICKET_NODE_CATEGORY.APPROVE]: '审批节点',
  [TICKET_NODE_CATEGORY.INFORM]: '知会节点',
  [TICKET_NODE_CATEGORY.AUTO]: '自动节点'
};

export const TICKET_NODE_CATEGORY_DESCRIPTION = {
  [TICKET_NODE_CATEGORY.START]: '开始节点(必须有且只有一个)：默认首节点,首节点无须处理,创建工单时默认审批通过',
  [TICKET_NODE_CATEGORY.END]: '结束节点(必须有且只有一个)：默认尾节点,尾节点无须处理,工单全部审批结束后默认审批通过',
  [TICKET_NODE_CATEGORY.APPROVE]: '审批节点：该类型节点需要审批',
  [TICKET_NODE_CATEGORY.INFORM]: '知会节点：该类型节点无须审批，运行到该节点时触发知会通知',
  [TICKET_NODE_CATEGORY.AUTO]: '自动节点：节点没有审批人,运行到该节点时,工单自动调用接口进行审批'
};

export const TICKET_NODE_RELATION = {
  NORMAL: 1,
  // SPLIT_AND: 2,
  // SPLIT_OR: 3,
  JOIN_AND: 4,
  JOIN_OR: 5
};

export const TICKET_NODE_RELATION_NAME = {
  [TICKET_NODE_RELATION.NORMAL]: '默认',
  // [TICKET_NODE_RELATION.SPLIT_AND]: '逻辑与',
  // [TICKET_NODE_RELATION.SPLIT_OR]: '逻辑或',
  [TICKET_NODE_RELATION.JOIN_AND]: '所有前置审批节点通过',
  [TICKET_NODE_RELATION.JOIN_OR]: '任一前置审批节点通过'
};

export const TICKET_NODE_CONDITION_OPERATOR = {
  EQ: 1,
  GT: 2,
  GTE: 3,
  LT: 4,
  LTE: 5
};

export const TICKET_NODE_CONDITION_OPERATOR_NAME = {
  [TICKET_NODE_CONDITION_OPERATOR.EQ]: '=',
  [TICKET_NODE_CONDITION_OPERATOR.GT]: '>',
  [TICKET_NODE_CONDITION_OPERATOR.GTE]: '>=',
  [TICKET_NODE_CONDITION_OPERATOR.LT]: '<',
  [TICKET_NODE_CONDITION_OPERATOR.LTE]: '<='
};

// 工单类型
export const TICKET_TYPE = {
  COMMITED: 1,
  APPROVED: 2,
  ATTENTION: 3,
};

// 审批状态
export const TICKET_APPROVED_STATUS = {
  PENDING: 1,
  APPROVED: 2
};

// 工单状态
export const TICKET_STATUS = {
  PROCESSING: 1,
  WITHDRAWN: 2,
  RESOLVED: 4,
  REJECTED: 5,
  WAITING: 6,
  HANG: 7
};

export const TICKET_STATUS_KEY = {
  PROCESSING: 'TicketStatus_PROCCESSING',
  WITHDRAWN: 'TicketStatus_WITHDRAWN',
  RESOLVED: 'TicketStatus_RESOLVED',
  REJECTED: 'TicketStatus_REJECTED',
  WAITING: 'TicketStatus_WAITING',
  HANG: 'TicketStatus_HANG'
};


export const TICKET_STATUS_NAME = {
  [TICKET_STATUS.PROCESSING]: '进行中', 
  [TICKET_STATUS.WITHDRAWN]: '已撤回', 
  [TICKET_STATUS.RESOLVED]: '通过',
  [TICKET_STATUS.REJECTED]: '驳回',
  [TICKET_STATUS.WAITING]: '待审批',
  [TICKET_STATUS.HANG]: '挂起'
};


// 工单状态对应样式
export const TICKET_STATUS_UI_TYPE = {
  [TICKET_STATUS.PROCESSING]: 'info', 
  [TICKET_STATUS.WITHDRAWN]: 'warning', 
  [TICKET_STATUS.RESOLVED]: 'success',
  [TICKET_STATUS.REJECTED]: 'danger',
  [TICKET_STATUS.HANG]: 'warning'
};


// 审批类型
export const TICKET_APPROVE_TYPE = {
  AGREE: 1, // 通过审批
  // REDIRECT: 2, // 转移
  REJECT: 3, // 驳回审批
  BACK_OUT: 4, // 退回工单
  HANG: 5, // 挂起工单
};

export const TICKET_APPROVE_TYPE_NAME = {
  [TICKET_APPROVE_TYPE.AGREE]: '通过',
  [TICKET_APPROVE_TYPE.REDIRECT]: '转发',
  [TICKET_APPROVE_TYPE.REJECT]: '驳回',
  [TICKET_APPROVE_TYPE.BACK_OUT]: '退回',
  [TICKET_APPROVE_TYPE.HANG]: '挂起',
};

export const TICKET_APPROVE_TYPE_UI = {
  [TICKET_APPROVE_TYPE.AGREE]: 'success',
  [TICKET_APPROVE_TYPE.REDIRECT]: 'warning',
  [TICKET_APPROVE_TYPE.REJECT]: 'danger',
  [TICKET_APPROVE_TYPE.BACK_OUT]: 'info',
  [TICKET_APPROVE_TYPE.HANG]: 'info',
};

// 节点状态
export const TICKET_NODE_STATUS = {
  CREATED: 1,
  PENDING: 2,
  PROCESSING: 3,
  RESOLVED: 4,
  REJECTED: 5,
  ABNORMAL: 6,
  HANG: 7,
  SKIP: 8
}; 

export const TICKET_NODE_STATUS_KEY = {
  CREATED: 'NodeStatus_CREATED',
  PENDING: 'NodeStatus_PENDING',
  PROCESSING: 'NodeStatus_PROCESSING',
  RESOLVED: 'NodeStatus_RESOLVED',
  REJECTED: 'NodeStatus_REJECTED',
  ABNORMAL: 'NodeStatus_ABNORMAL',
  HANG: 'NodeStatus_HANG',
  SKIP: 'NodeStatus_SKIP'
}; 

export const TICKET_NODE_STATUS_NAME = {
  [TICKET_NODE_STATUS.CREATED]: '未激活',
  [TICKET_NODE_STATUS.PENDING]: '待处理',
  [TICKET_NODE_STATUS.PROCESSING]: '处理中',
  [TICKET_NODE_STATUS.RESOLVED]: '已通过',
  [TICKET_NODE_STATUS.REJECTED]: '已驳回',
  [TICKET_NODE_STATUS.ABNORMAL]: '异常',
  [TICKET_NODE_STATUS.HANG]: '挂起',
  [TICKET_NODE_STATUS.SKIP]: '跳过'
};

// 审批角色
export const TICKET_APPROVAL_USER_TYPE = {
  // 用户
  USER: 1,
  // 用户组/角色
  GROUP: 2
};
export const TICKET_APPROVAL_USER_TYPE_KEY = {
  USER: 'RoleType_USER',
  GROUP: 'RoleType_GROUP'
};

