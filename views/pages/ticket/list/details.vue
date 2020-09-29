<template>
  <div class="ticket-detail-container">
    <div v-if="loading" class="loading">
      <span v-loading="true" />
    </div>
    <template v-else>
      <section class="ticket-info-wrap">
        <div class="header-wrap">
          <div class="header">
            工单详情 - {{ ticketDetail.series_num }}
          </div> 
          <ticket-actions :ticket-detail="ticketDetail" @change="handleTicketStatusChange" />
        </div>

        <div class="ticket-info-container">
          <div class="ticket-info-item">
            <label>名称</label>
            {{ ticketDetail.name }}
          </div>
          <div class="ticket-info-item">
            <label>类型</label>
            {{ ticketTypeMap[ticketDetail.type] }}
          </div>
          <div class="ticket-info-item">
            <label>发起人</label>
            {{ getUserInfo(ticketDetail.creator).name || '-' }}
          </div>
          <div class="ticket-info-item">
            <label>状态</label>
            <q-tag :type="TICKET_STATUS_UI_TYPE[transformEnumKey('TICKET_STATUS', ticketDetail.status)]">
              {{ TICKET_STATUS_NAME[transformEnumKey('TICKET_STATUS', ticketDetail.status)] }}
            </q-tag>
          </div>
          <div class="ticket-info-item">
            <label>发起时间</label>
            {{ ticketDetail.created | formatDate }}
          </div>
          <div class="ticket-info-item">
            <label>耗时</label>
            {{ ticketDetail.created | timeDiffNow }}
          </div>
          <div class="ticket-info-item">
            <label>描述</label>
            {{ ticketDetail.description }}
          </div>
        </div>
      </section>
      <section>
        <div class="header">
          工单信息
        </div>
        <dynamic-form
          v-if="ticketDetail"
          ref="formComponent"
          v-model="ticketDetail.data"
          :handler="handler"
          class="detail-form-component"
          :render-options="dynamicFormoptions"
        />
      </section>
      <section>
        <div class="header">
          流程状态
        </div>
        <ticket-detail-flow :ticket-detail="ticketDetail" />
      </section>
      <section>
        <div class="header">
          审批意见
        </div>
        <div class="block">
          <q-timeline>
            <template v-for="(node, key) in flowNodes">
              <q-timeline-item
                v-if="node.status !== TICKET_NODE_STATUS_KEY.CREATED && node.status !== TICKET_NODE_STATUS_KEY.PENDING"
                :key="key"
                :timestamp="node.modified | formatDate"
                hide-timestamp
                placement="top"
              >
                <b>{{ node.name }}</b> <span>{{ node.modified | formatDate }}</span> <span>{{ TICKET_NODE_STATUS_NAME[transformEnumKey('TICKET_NODE_STATUS', node.status)] }}</span> 
                <template v-if="node.approver">
                  <p><b>处理人</b> {{ getUserInfo(node.approver).name || '-' }}</p>
                  <p><b>处理意见</b> {{ node.approve_msg }}</p>
                </template>
                <template v-else>
                  <p><b>处理人</b> 系统</p>
                  <p><b>处理意见</b> 系统自动处理</p>
                </template>
              </q-timeline-item>
            </template>
          </q-timeline>
        </div>        
      </section>
    </template>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { get, isEmpty, isNil, differenceWith, isEqual } from 'lodash';
import ticketApi from '@/services/api';
import { getApprovalUsers, getApprovalGroups } from '@/services/ticket';

import DynamicForm from '@/views/components/dynamic-form';
import { JsonSchemaHandler } from '@cbb/dynamic-form-json-schema';
import TicketActions from '@/views/components/ticket/actions';
import TicketDetailFlow from '@/views/components/ticket/detail-flow';

import { transformEnumKey } from '@/utils';

import { TICKET_STATUS, TICKET_STATUS_NAME, TICKET_STATUS_UI_TYPE, TICKET_NODE_STATUS_KEY, TICKET_NODE_STATUS_NAME, TICKET_APPROVAL_USER_TYPE_KEY } from '@/constants/index';

export default {
  components: {
    DynamicForm,
    TicketActions,
    TicketDetailFlow
  },
  filters: {
    formatDate(date) {
      return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
    },
    timeDiffNow(date) {
      const days = dayjs().diff(dayjs(date), 'days');
      const hours = dayjs().diff(dayjs(date), 'hours') % 24;
      const minutes = dayjs().diff(dayjs(date), 'minutes') % 60;
      const seconds = dayjs().diff(dayjs(date), 'seconds') % 60;
      return days + ' 天 ' + hours + ' 时 ' + minutes + ' 分 ' + seconds + ' 秒 ';
    }
  },
  data() {
    return {
      TICKET_STATUS, 
      TICKET_STATUS_NAME,
      TICKET_STATUS_UI_TYPE,
      TICKET_NODE_STATUS_KEY,
      TICKET_NODE_STATUS_NAME,

      loading: true,

      handler: null,
      ticketDetail: {},
      ticketTypeMap: {},

      pagination: {
        hideOnSinglePage: true,
      },
      dynamicFormoptions: {
        formAttributes: {
          disabled: true
        }
      },
    };
  },
  computed: {
    flow () {
      return get(this, 'ticketDetail.flow', {});
    },
    flowNodes () {
      return get(this, 'ticketDetail.flow.nodes', []);
    }
  },
  async created () {
    this.initTicketTypeMap();
    await this.initTicketDetail();
  },
  methods: {
    transformEnumKey,

    // 获取工单类型
    async initTicketTypeMap () {
      const { templateType } = await ticketApi.apiV1TemplatesTypeGet();
      const typeMap = {};
      templateType.forEach(item => {
        typeMap[item.type] = item.name;
      });
      this.ticketTypeMap = typeMap;
    },
    
    //获取工单数据详情
    async initTicketDetail () {
      this.loading = true;
      await qp.errorHandling.catchError(async () => {
        const id = this.$route.params.id;
        const result = await ticketApi.apiV1TicketIdGet({
          id
        });

        try {
          this.ticketDetail = await this.formatTicketDetail(result);
        } catch (error) {
          this.ticketDetail = result;
        }
        
        this.initJsonSchemaHandler();
      }, () => {
        let message = '找不到当前工单，或许已被删除';
        qp.feedback.showToast({
          type: 'error',
          message
        });
      });
      this.loading = false;
    },
    // 格式化工单详情
    async formatTicketDetail (ticketDetail) {
      const { creator, flow = {} } = ticketDetail;
      const { nodes = [] } = flow;
      const userIds = new Set();
      const groupIds = new Set();

      // 工单创建者
      userIds.add(creator);

      nodes.forEach(node => {
        // 节点审批人
        if (!isNil(node.approver) && !isEmpty(node.approver)) userIds.add(node.approver);

        // 可审批用户/用户组
        get(node, 'roles', []).forEach(role => {
          if (role.type === TICKET_APPROVAL_USER_TYPE_KEY.USER) {
            userIds.add(role.id);
          } else if (role.type === TICKET_APPROVAL_USER_TYPE_KEY.GROUP) {
            groupIds.add(role.id);
          }
        });
      });

      // 赋值用户列表
      const result = await Promise.all([
        userIds.size > 0 ? getApprovalUsers([...userIds]) : null,
        groupIds.size > 0 ? getApprovalGroups([...groupIds]) : null
      ]);

      const [users = [], groups = []] = result;
      // 合并group中的 users
      groups.forEach(group => {
        const differenceUsers = differenceWith(group.users, users, isEqual);
        users.push(...differenceUsers);
      });

      ticketDetail.users = users;
      ticketDetail.groups = groups;

      return ticketDetail;
    },
    initJsonSchemaHandler() {
      let schema = JSON.parse(get(this, 'ticketDetail.config.contentSchema', '{}'));
      schema = JsonSchemaHandler.fillData(schema, get(this, 'ticketDetail.data', {}));
      this.handler = new JsonSchemaHandler(schema);
    },
    getUserInfo (id) {
      const userInfo = get(this, 'ticketDetail.users', []).find(user => user.id === id);
      return userInfo || {};
    },
    getGroupInfo (id) {
      const userInfo = get(this, 'ticketDetail.groups', []).find(group => group.id === id);
      return userInfo || {};
    },
    handleTicketStatusChange () {
      this.initTicketDetail();
    }
  }
};
</script>

<style lang="scss" scoped>

.ticket-detail-container {
  background: none !important;
  padding: 0 !important;

  .loading {
    background: $color-white;
    flex: 1;
    padding: $s-2;
    display: flex;
    justify-content: center;
  }

  .flow-chart-wrap {
    height: $s-30;
    position: relative;
  }

  .detail-form-component {
    max-width: 60%;
  }

  .header {
    font-size: $s-2;
    font-weight: $font-weight-3;
    margin-bottom: $s-2;
    line-height: 1;
    position: relative;
    padding-left: $size-base;
    align-items: center;

    &::after {
      content: '';
      position: absolute;
      width: $size-small;
      border-left: solid $line-2 $color-link-1;
      left: 0;
      top: 50%;
      height: 90%;
      transform: translateY(-50%);
    }
  }

  .header-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .header {
      margin: 0;
    }
  }

  .ticket-info-wrap {
    margin: (-$s-2) (-$s-2) $s-2;

    .ticket-info-container {
      display: flex;
      flex-flow: row wrap;
      font-size: $font-size-body-2;
      flex: 5 1 0%;

      .ticket-info-item {
        label {
          display: block;
          color: $color-text1-3;
          margin-bottom: $s-1;
        }

        width: 25%;
        font-size: $font-size-body-1;
        margin-top: $s-2;
      }
    }
  }

  section {
    background-color: $color-white;
    padding: $s-2;
    margin-bottom: $s-3;

    &:last-child {
      margin: 0;
    }

    .button-column {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}

</style>
