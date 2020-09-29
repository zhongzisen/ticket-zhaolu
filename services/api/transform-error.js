import { get, isNil, isEmpty } from 'lodash';
import camelCase from 'camelcase';

import { ERROR_CODES, ERROR_MESSAGE } from '@/constants/error';
import { STATUS_MAP, HTTP_STATUS_MAP  } from '@/shared/constants/status';

const translateStatus = (status) => {
  if (STATUS_MAP[status]) {
    return STATUS_MAP[status];
  } else if (HTTP_STATUS_MAP[status]) {
    return HTTP_STATUS_MAP[status];
  } else {
    return STATUS_MAP.UNKNOWN;
  }
};

const transformBizError = (message) => {
  const regStr = 'desc\\s=\\s';
  const errorDesc = get(message.match(new RegExp(`${regStr}.+`)), [0], '').replace(new RegExp(regStr), '');

  if (isNil(errorDesc) || isEmpty(errorDesc)) return null;
  
  const result = {
    message: errorDesc
  };

  const code = Object.keys(ERROR_CODES).find(key => {
    const reg = new RegExp(ERROR_CODES[key]);
    return reg.test(errorDesc);
  });

  if (!isNil(code)) {
    result.code = code;
    result.message = ERROR_MESSAGE[code];
  }
  return result;
};

export const transformError = (originError, transformRule = {
  status: 'status',
  message: 'message',
  details: 'details'
}) => {
  const message = get(originError, transformRule.message, '');
  const status = translateStatus(get(originError, transformRule.status, originError.status));
  const details = get(originError, transformRule.details, []);
  const bizErrorInfo = transformBizError(message);

  const error = new Error(message);
  error.details = details;
  error.status = status;
  error[camelCase(`is${status}`)] = true;

  if (bizErrorInfo !== null) {
    error.isBizError = true;
    error.code = bizErrorInfo.code;
    error.message = bizErrorInfo.message;
  }

  if (originError instanceof Error) {
    error.stack = originError.stack;
  }
  error.origin = originError;
  
  return error;
};
