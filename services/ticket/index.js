import { get } from 'lodash';
import { TICKET_APPROVAL_USER_TYPE } from '@/constants';
import ticketApi from '@/services/api';

export const getApprovalUsers = async (ids) => {
  const result = await ticketApi.apiV2UserApprovalPost({
    data: {
      ids: [...new Set(ids)],
      type: TICKET_APPROVAL_USER_TYPE.USER
    }
  });

  return ids.map(id => {
    return get(result, 'users', []).find(user => user.id === id) || {};
  });
};

export const getApprovalGroups = async (ids) => {
  const result = await ticketApi.apiV2UserApprovalPost({
    data: {
      ids: [...new Set(ids)],
      type: TICKET_APPROVAL_USER_TYPE.GROUP
    }
  });

  return ids.map(id => {
    return get(result, 'group_users', []).find(group => group.group.id === id) || {};
  });
};
