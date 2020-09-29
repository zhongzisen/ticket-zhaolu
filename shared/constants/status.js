export const STATUS_MAP = {
  OK: 'OK',
  CANCELLED: 'CANCELLED',
  UNKNOWN: 'UNKNOWN',
  INVALID_ARGUMENT: 'INVALID_ARGUMENT',
  DEADLINE_EXCEEDED: 'DEADLINE_EXCEEDED',
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  RESOURCE_EXHAUSTED: 'RESOURCE_EXHAUSTED',
  FAILED_PRECONDITION: 'FAILED_PRECONDITION',
  ABORTED: 'ABORTED',
  OUT_OF_RANGE: 'OUT_OF_RANGE',
  UNIMPLEMENTED: 'UNIMPLEMENTED',
  INTERNAL: 'INTERNAL',
  UNAVAILABLE: 'UNAVAILABLE',
  DATA_LOSS: 'DATA_LOSS',
};

export const HTTP_STATUS_MAP = {
  // 客户端指定了无效参数。
  400: 'INVALID_ARGUMENT',

  // // 请求无法在当前系统状态下执行，例如删除非空目录。
  // 400: 'FAILED_PRECONDITION',

  // // 客户端指定了无效范围。
  // 400: 'OUT_OF_RANGE',

  // 由于 OAuth 令牌丢失、无效或过期，请求未通过身份验证。
  401: 'UNAUTHENTICATED',

  // 客户端权限不足。可能的原因包括 OAuth 令牌的覆盖范围不正确、客户端没有权限或者尚未为客户端项目启用 API。
  403: 'PERMISSION_DENIED',

  // 找不到指定的资源，或者请求由于未公开的原因（例如白名单）而被拒绝。。
  404: 'NOT_FOUND',

  // // 并发冲突，例如读取/修改/写入冲突。
  // 409: 'ABORTED',

  // 客户端尝试创建的资源已存在。
  409: 'ALREADY_EXISTS',

  // 资源配额不足或达到速率限制。
  429: 'RESOURCE_EXHAUSTED',

  // 请求被客户端取消。
  499: 'CANCELLED',

  // // 出现不可恢复的数据丢失或数据损坏。
  // 500: 'DATA_LOSS',

  // // 出现未知的服务器错误。通常是服务器错误。
  // 500: 'UNKNOWN',

  // 出现未知的服务器错误。通常是服务器错误。
  500: 'INTERNAL',

  // API 方法未通过服务器实现。
  501: 'NOT_IMPLEMENTED',

  // 服务不可用。通常是服务器已关闭。
  503: 'UNAVAILABLE',

  // 超出请求时限。
  504: 'DEADLINE_EXCEEDED',
};

export const BUSINESS_STATUS_MAP = {
  // 租户管理
  201001: 'TENANT_DELETE_ERROR',  // "删除租户失败"
  201002: 'INSERT_TENANT_FAILED',  // "添加租户失败"
  201003: 'UPDATE_TENANT_FAILED',  // "更新租户失败"
  101004: 'TENANT_NOT_FOUND',  // "租户不存在"
  101005: 'TENANT_EXIST_ERROR',  // "租户已存在"
  101010: 'DELETE_TENANT_ROLE_HAS_USER',  // "该租户角色内有用户，请先删除用户"
  301011: 'GET_USER_LIST_BY_ROLE_ID_ERROR',  // "身份平台获取租户角色用户列表接口异常"
};
