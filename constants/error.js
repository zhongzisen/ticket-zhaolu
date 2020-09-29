export const ERROR_CODES = {
  // 流程相关
  10001: 'key doesn\'t exist',
  10002: 'the template already has flow',
  10003: 'at least two nodes are required',
  10004: 'at least one relations are required',
  10005: 'there can be only one start node',
  10006: 'there can be only one end node',
  10007: 'missing start/end node',
  10008: 'node\'s Id can\'t be repeated',
  10009: 'relation\'s start node id  doesn\'t exist',
  10010: 'relation\'s end node id  doesn\'t exist',
  10011: 'node has not relation:',
  10012: 'rel\'s start id not in node list',
  10013: 'rel\'s end id not in node list',

  // 工单相关
  20001: 'dynamic node\'s api is nil',
  20002: 'this ticket cannot be Withdrawn'
};

export const ERROR_MESSAGE = {
  10001: '模板不存在',
  10002: '当前模板已存在审批流程',
  10003: '审批流程至少需要两个节点',
  10004: '审批流程至少需要一条节点关系',
  10005: '审批流程只能有一个开始节点',
  10006: '审批流程只能有一个结束节点',
  10007: '审批流程缺少开始/结束节点',
  10008: '存在重复ID的节点',
  10009: '节点关系中找不到开始',
  10010: '节点关系中找不到结束',
  10011: '存在未设置关系的节点',
  10012: '找不到节点关系中描述的开始节点',
  10013: '找不到节点关系中描述的结束节点',
  20001: '未配置动态获取审批人接口',
  20002: '当前工单已进入流程，不能被撤回'
};
