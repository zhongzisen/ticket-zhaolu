import axios from 'axios';
import { get, set } from 'lodash';
import { BP_TOKEN_HEADER } from '@/shared/constants';
import { ApiService } from '@bfe/bpv3-web-api';
import { zeus } from '@cbb/zeus';
import { STATUS_MAP } from '@/shared/constants/status';
import { transformError } from './transform-error';


const instance = axios.create({
  // baseURL: BASE_URL
  headers: {
    [BP_TOKEN_HEADER]: zeus.authentication.token
  }
});

instance.interceptors.response.use(function (response) {
  // 注：必须返回不包含 axios 包装的请求体数据
  return response.data;
}, function (originError) {
  // 处理请求超时及网络错误
  if (get(originError, 'response.data.error', null) === null) {
    const { message } = originError;
    if (/timeout\s*of/gi.test(message)) {
      // timeout error
      set(originError, 'response.data.status', STATUS_MAP.DEADLINE_EXCEEDED);
      set(originError, 'response.data.message', message);
    } else if (/network\s*error/gi.test(message)) {
      // network error
      set(originError, 'response.data.status', STATUS_MAP.UNKNOWN);
      set(originError, 'response.data.message', message);
    }
  }

  const transformRule = {
    status: 'response.data.code',
    message: 'response.data.msg',
    details: 'response.data'
  };
  const error = transformError(originError, transformRule);
  /*
    转换后的错误结构体示例：
    {
      status: "UNAUTHENTICATED"
      isUnauthenticated: true
      message: "请输入登录名"
      details: ...
      origin: ...
      stack: "Error: Request failed with status code 401 ..."
    }
  */

  return Promise.reject(error);
});

export default new ApiService(instance);
