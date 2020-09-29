<template>
  <div class="ticket-actions">
    <q-button
      v-for="(item, index) in ticketActions"
      :key="index"
      :type="item.type" 
      @click="approveTicket(item)"
    >
      {{ item.name }}
    </q-button>

    <q-button 
      v-if="canWithdraw && ticketDetail.status === TICKET_STATUS_KEY.PROCESSING" 
      @click="handleWithdrawTicket"
    >
      撤回工单
    </q-button>

    <q-dialog
      ref="approveDialog"
      :title="approveDialog.title"
      :visible.sync="approveDialog.show"
    >
      <q-input
        v-model="approveDialog.message"
        type="textarea"
        :rows="4"
        :placeholder="approveDialog.placeholder"
        :maxlength="approveDialog.maxlength"
      />
      
      <div v-if="approveDialog.deferred" class="approve-message-footer">
        <q-button type="primary" @click="handleApproveDialogSubmit">
          确定
        </q-button>
      </div>
    </q-dialog>
  </div>
</template>

<script>
import { get, isNil } from 'lodash';
import ticketApi from '@/services/api';
import Deferred from '@/shared/utils/deferred';

import { 
  TICKET_STATUS_KEY,
  TICKET_NODE_STATUS_KEY,
  TICKET_NODE_CATEGORY_KEY,
  TICKET_APPROVE_TYPE,
  TICKET_APPROVE_TYPE_NAME,
  TICKET_APPROVE_TYPE_UI } from '@/constants/index';

export default {
  name: 'TicketActions',
  props: {
    ticketDetail: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      TICKET_STATUS_KEY,

      ticketActions: [],
      userInfo: {},

      approveDialog: {
        show: false,
        title: '',
        placeholder: '',
        maxlength: 225,
        message: '',
        deferred: null
      }
    };
  },
  computed: {

    nodes () {
      return get(this, 'ticketDetail.flow.nodes', []);
    },
    relations () {
      return get(this, 'ticketDetail.flow.relations', []);
    },

    // 当前节点
    currentNodes () {
      return this.nodes.filter(node => {
        return node.status === TICKET_NODE_STATUS_KEY.PENDING || node.status === TICKET_NODE_STATUS_KEY.REJECTED;
      });
    },

    // 当前审批节点
    currentApproveNode () {
      return this.currentNodes.find(node => node.approve_able === true);
    },

    // 是否可撤回
    canWithdraw () {
      const userId = get(this, 'userInfo.staffId.id');
      // 查找开始节点
      const startNode = this.nodes.find(node => node.category === TICKET_NODE_CATEGORY_KEY.START);
      // 根据开始节点所连关系查找第一个层审批节点
      const firstApproveRealations = this.relations.filter(relation => relation.start === startNode.id);
      const firstApproveNodeIds = firstApproveRealations.map(relation => relation.end);
      const firstApproveNodes = this.nodes.filter(node => firstApproveNodeIds.includes(node.id));
      // 如果第一层审批节点已经有处理过的，则判定进入工单流程，无法撤回
      const processing = !!firstApproveNodes.find(node => {
        return node.status !== TICKET_NODE_STATUS_KEY.PENDING;
      });

      return userId === this.ticketDetail.creator && !processing;
    }
  },
  async created () {
    await this.initCurrentUserInfo();
    this.initTicketActions();
  },
  methods: {
    async initCurrentUserInfo () {
      this.userInfo = await qp.user.getUserInfo();
    },
    initTicketActions () {
      const ticketActions = [];

      Object.values(TICKET_APPROVE_TYPE).forEach(action => {

        if (!isNil(this.currentApproveNode) && this.currentApproveNode.status === TICKET_NODE_STATUS_KEY.PENDING) {
          ticketActions.push({
            name: TICKET_APPROVE_TYPE_NAME[action],
            type: TICKET_APPROVE_TYPE_UI[action],
            action
          });
        }
      });
      this.ticketActions = ticketActions;
    },
    getApproveMessage ({ title = '填写意见', placeholder = '请填写意见' }) {
      this.approveDialog.title = title;
      this.approveDialog.placeholder = placeholder;
      this.approveDialog.show = true;

      const deferred = new Deferred(); 
      this.approveDialog.deferred = deferred;

      return deferred.promise;
    },
    handleWithdrawTicket () {
      qp.feedback.showModal({
        type: 'warning',
        title: '提示',
        message: '确定删除撤回这个工单吗？',
        showCancelButton: true,
        callback: (action) => {
          if (action === 'confirm') {
            this.doWithdrawTicket();
          }
        }
      });
    },
    async doWithdrawTicket () {
      const { id } = this.ticketDetail;
      await qp.errorHandling.catchError(async () => {
        await ticketApi.apiV1TicketIdPost({
          id,
          data: {}
        });

        qp.feedback.showToast({
          type: 'success',
          message: '工单撤回成功'
        });
        this.$emit('change');
      }, (error, event) => {
        console.info(error);
        let message = '工单撤回失败';
        if (error.isBizError) message = error.message;

        qp.feedback.showToast({
          type: 'error',
          message
        });
        event.stopPropagation();
      });

    },
    handleApproveDialogSubmit () {
      this.approveDialog.show = false;
      this.approveDialog.deferred.resolve(this.approveDialog.message);

      this.$refs['approveDialog'].$once('closed', () => {
        this.approveDialog.title = '';
        this.approveDialog.message = '';
        this.approveDialog.placeholder = '';
        this.approveDialog.deferred = null;
      });
    },
    async approveTicket (actionItem) {
      const { id: ticketId } = this.ticketDetail;
      const nodeId = get(this, 'currentApproveNode.id');
      const message = await this.getApproveMessage({
        title: actionItem.name
      });

      await qp.errorHandling.catchError(async () => {
        await ticketApi.apiV1TicketNodesIdPost({
          id: nodeId,
          data: {
            id: nodeId,
            ticketId,
            action: actionItem.action,
            approve_msg: message
          }
        });

        qp.feedback.showToast({
          type: 'success',
          message: '操作成功'
        });
        this.$emit('change');
      }, (error, event) => {
        console.info(error);
        let message = '操作失败';
        if (error.isBizError) message = error.message;

        qp.feedback.showToast({
          type: 'error',
          message
        });
        event.stopPropagation();
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.approve-message-footer {
  text-align: right;
  margin-top: $s-2;
}
</style>
