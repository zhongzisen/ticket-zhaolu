import { get } from 'lodash';
import camelCase from 'camelcase';

import { STATUS_MAP, HTTP_STATUS_MAP, BUSINESS_STATUS_MAP  } from '@/shared/constants/status';

const translateStatus = (status) => {
  if (STATUS_MAP[status]) {
    return STATUS_MAP[status];
  } else if (BUSINESS_STATUS_MAP[status]) {
    return BUSINESS_STATUS_MAP[status];
  } else if (HTTP_STATUS_MAP[status]) {
    return HTTP_STATUS_MAP[status];
  } else {
    return STATUS_MAP.UNKNOWN;
  }
};

export const transformError = (originError, transformRule = {
  status: 'status',
  message: 'message',
  details: 'details'
}) => {
  const message = get(originError, transformRule.message, '');
  const status = translateStatus(get(originError, transformRule.status, originError.status));
  const details = get(originError, transformRule.details, []);

  const error = new Error(message);
  error.details = details;
  error.status = status;
  error[camelCase(`is${status}`)] = true;

  if (originError instanceof Error) {
    error.stack = originError.stack;
  }
  error.origin = originError;

  return error;
};
