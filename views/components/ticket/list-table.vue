<template>
  <div class="ticket-list-table">
    <q-row
      class="table-header"
      type="flex"
      justify="between"
      align="middle"
    >
      <q-col :span="1" class="ticket-status">
        工单类型：
      </q-col>
      <q-col :span="3">
        <q-select v-model="currentTemplateType" placeholder="选择工单类型" @change="ticketFilter">
          <q-option
            v-for="item in templateTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </q-select>
      </q-col>
      <q-col :span="6" :offset="14">
        <q-input
          v-model="keyword"
          clearable
          placeholder="输入工单名称关键字"
          @keyup.enter.native="search"
          @clear="search"
        >
          <i
            slot="prefix"
            class="q-icon-search q-input__icon"
            @click="search"
          />
        </q-input>
      </q-col>  
    </q-row>

    <biz-table
      ref="table"
      stripe
      border
      :fetch-data="fetchData"
      :pagination-options="pagination"
    >
      <biz-column title="工单名称">
        <template v-slot="{row}">
          <span>{{ row.name }}</span>
        </template>
      </biz-column>

      <biz-column title="工单编号" prop="series_num" />

      <biz-column
        title="工单类型"
        width="120px"
      >
        <template v-slot="{row}">
          <span>{{ get(templateTypeOptions.find(item => item.value === row.type), 'label', '') }}</span>
        </template>
      </biz-column>

      <biz-column
        prop="status"
        title="工单状态"
        width="100px"
        align="center"
      >
        <template v-slot="{row}">
          <q-tag :type="TICKET_STATUS_UI_TYPE[transformEnumKey('TICKET_STATUS', row.status)]">
            {{ TICKET_STATUS_NAME[transformEnumKey('TICKET_STATUS', row.status)] }}
          </q-tag>
        </template>
      </biz-column>

      <biz-column
        title="发起人" 
        width="120px"
      >
        <template v-slot="{ row }">
          <span>{{ getApprovalUser(row.creator).name || '-' }}</span>
        </template>
      </biz-column>

      <biz-column
        title="发起时间"
        width="160px"
      >
        <template v-slot="{row}">
          <span>{{ row.created|formatData }}</span>
        </template>
      </biz-column>

      <biz-column title="操作" :width="params.type === TICKET_TYPE.COMMITED ? 120 : 80">
        <template v-slot="{row}">
          <q-button v-if="params.type === TICKET_TYPE.COMMITED" type="text button-remove" @click="handleCreate(row)">
            重新发起
          </q-button>

          <q-button type="text button-remove" @click="handleDetails(row.id)">
            详情
          </q-button>
        </template>
      </biz-column>
    </biz-table>
  </div>
</template>

<script>
import { isNil, get } from 'lodash';
import dayjs from 'dayjs';
import ticketApi from '@/services/api';
import { getApprovalUsers } from '@/services/ticket';
import { transformEnumKey } from '@/utils';

import { TICKET_TYPE, TICKET_STATUS_NAME, TICKET_STATUS_UI_TYPE } from '@/constants/index';

export default {
  name: 'TicketListTable',
  filters: {
    formatData (date) {
      return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  props: {
    params: {
      type: Object,
      default: () => {
        return {}; 
      }
    }
  },
  data: function() {
    return {
      TICKET_TYPE,
      TICKET_STATUS_NAME,
      TICKET_STATUS_UI_TYPE,

      keyword: '',
      pagination: {
        hideOnSinglePage: false,
      },
      currentTemplateType: '',
      templateTypeOptions: [],

      approvalUsers: []
    };
  },
  created() {
    this.initTemplateTypeOptions();
  },
  methods: {
    get,
    transformEnumKey,

    async initTemplateTypeOptions() {
      const { templateType = [] } = await ticketApi.apiV1TemplatesTypeGet();
      const options = templateType.map(template => {
        return {
          value: template.type,
          label: template.name
        };
      });

      options.unshift({
        value: '',
        label: '全部'
      });

      this.templateTypeOptions = options;
    },
    async fetchData({ pagination}) {
      const { offset, limit} = pagination;
      const payload = {
        offset, limit,
        desc: 'created',
        series_num: this.currentTemplateType,
        ...this.params
      };

      if (!isNil(this.keyword) && this.keyword !== '') {
        payload.keyword = this.keyword;
      }
      const { tickets, total } = await ticketApi.apiV1UserTicketsGet(payload);  
      this.initApprovalUsers(tickets);

      return {
        items: tickets,
        total
      };

    },
    async initApprovalUsers (tickets) {
      const ids = tickets.map(ticket => ticket.creator);
      // 过滤已存在用户信息
      ids.filter(id => !this.approvalUsers.find(user => user.id !== id));

      const users = await getApprovalUsers(ids);
      this.approvalUsers.push(...users);
    },
    getApprovalUser (id) {
      return this.approvalUsers.find(user => user.id === id) || {};
    },
    search() {
      this.$refs.table && this.$refs.table.gotoFirstPage(true);
    },
    handleCreate (ticket) {
      this.$router.push({
        name: 'ticket-create',
        params: {
          templateKey: ticket.template_key
        },
        query: {
          from: ticket.id
        }
      });
    },
    handleDetails (id) {
      this.$router.push({
        name: 'ticket-details',
        params: {
          id
        }
      });
    },
    ticketFilter() {
      this.$refs.table && this.$refs.table.gotoFirstPage(true);
    }
  }
};
</script>

<style lang="scss" scoped>
.ticket-list-table {
  box-sizing: border-box;

  .table-header {
    margin-bottom: $s-2;

    .ticket-status {
      width: $s-10;
    }
  }
}
</style>
