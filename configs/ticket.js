import { TICKET_TYPE, TICKET_APPROVED_STATUS } from '@/constants';

export const ticketListTypes = [{
  label: '我发起的工单',
  key: 'commited',
  params: {
    type: TICKET_TYPE.COMMITED
  }
}, {
  label: '待我审批',
  key: 'pending',
  params: {
    type: TICKET_TYPE.APPROVED,
    approve_status: TICKET_APPROVED_STATUS.PENDING
  }
}, {
  label: '已审批',
  key: 'approved',
  params: {
    type: TICKET_TYPE.APPROVED,
    approve_status: TICKET_APPROVED_STATUS.APPROVED
  }
}, {
  label: '知会',
  key: 'attention',
  params: {
    type: TICKET_TYPE.ATTENTION
  }
}];
