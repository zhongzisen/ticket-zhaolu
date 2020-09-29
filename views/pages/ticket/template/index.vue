<template>
  <div class="template-list-table">
    <q-row class="template-header">
      <q-col :span="3">
        <q-button type="primary" @click="createNewTemplate">
          新建模板
        </q-button>
      </q-col>
      <q-col :span="5" :offset="16">
        <q-input
          v-model="keyword"
          placeholder="输入模板名称关键字"
        >
          <i
            slot="suffix"
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
      :table-loading="loading"
    >
      <biz-column title="模板标识" prop="key" />      
      <biz-column title="模板名称" prop="name" />

      <biz-column title="模板类型">
        <template v-slot="{ row }">
          <span>{{ templateTypeMap[row.type] || '-' }}</span>
        </template>
      </biz-column>
      
      <biz-column title="模板描述" prop="description" />
      
      <biz-column title="创建人">
        <template v-slot="{ row }">
          <span>{{ getApprovalUser(row.creator).name || '-' }}</span>
        </template>
      </biz-column>
      <biz-column
        title="创建时间"
        min-width="100px"
      >
        <template v-slot="{row}">
          <span>{{ row.created|formatData }}</span>
        </template>
      </biz-column>
      <biz-column
        prop="enable"
        title="发布状态"
      >
        <template v-slot="{row}">
          <q-switch
            v-model="row.enable"
            class="q-switch--mini"
            @change="handleChange(row)"
          />
        </template>
      </biz-column>
      <biz-column title="操作" :width="100">
        <template v-slot="{row}">
          <q-button type="text" @click="handleEdit(row.key)">
            修改
          </q-button>

          <q-button type="text" @click="handleDelete(row.key)">
            删除
          </q-button>
        </template>
      </biz-column>
    </biz-table>
  </div>
</template>

<script>
import { isNil } from 'lodash';
import dayjs from 'dayjs';
import ticketApi from '@/services/api';
import { getApprovalUsers } from '@/services/ticket';

export default {
  name: 'TicketTemplate',
  filters: {
    formatData(data) {
      return dayjs(data).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  data: function() {
    return {
      loading: false,
      keyword: '',
      pagination: {
        hideOnSinglePage: false
      },
      userInfo: {},

      approvalUsers: [],
      templateTypeMap: {}
    };
  },
  created () {
    this.initTemplateTypeMap();
  },
  methods: {
    async fetchData({ pagination }) {
      const { offset, limit} = pagination;
      const payload = {
        offset, limit,
        desc: 'created',
        ...this.params
      };
      if (!isNil(this.keyword) && this.keyword !== '') {
        payload.name = this.keyword;
      }
      const { templates, total } = await ticketApi.apiV1TemplatesGet(payload);
      this.initApprovalUsers(templates);

      return {
        items: templates,
        total
      };
    },

    // 获取类型
    async initTemplateTypeMap () {
      const { templateType } = await ticketApi.apiV1TemplatesTypeGet();
      const typeMap = {};
      templateType.forEach(item => {
        typeMap[item.type] = item.name;
      });
      this.templateTypeMap = typeMap;
    },
    async initApprovalUsers (templates) {
      const ids = templates.map(template => template.creator);
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
    handleChange(row) {
      const payload = {
        key: row.key,
        data: {
          enable: row.enable
        }
      };
      qp.errorHandling.catchError(async () => {
        await ticketApi.apiV1TemplateKeyPost(payload);
        qp.feedback.showToast({
          type: 'success',
          message: '状态修改成功'
        });
      }, (error) => {

        let message = '状态修改失败, 请稍后重试';
        if (error.isDeleteTenantRoleHasUser) message = error.message;

        qp.feedback.showToast({
          type: 'error',
          message
        });
        row.enable = !row.enable;
      });
    },
    handleEdit (key) {
      this.$router.push({
        name: 'template-editor',
        params: {
          key
        }
      });
    },
    handleDelete (key) {
      qp.feedback.showModal({
        type: 'warning',
        title: '提示',
        message: '确定删除该模板吗？',
        showCancelButton: true,
        callback: (action) => {
          if (action === 'confirm') {
            this.doDelete(key);
          }
        }
      });
    },
    async doDelete(key) {
      const payload = {
        key: '' + key
      };
      qp.errorHandling.catchError(async () => {
        await ticketApi.apiV1TemplateKeyDelete(payload);
        qp.feedback.showToast({
          type: 'success',
          message: '模板删除成功'
        });
        this.$refs.table && this.$refs.table.reload();
      }, (error) => {
        let message = '删除失败, 请稍后重试';
        if (error.isDeleteTenantRoleHasUser) message = error.message;

        qp.feedback.showToast({
          type: 'error',
          message
        });
      });
      
    },
    createNewTemplate() {
      this.$router.push({
        name: 'template-editor'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.template-list-table {
  padding: $s-2;
  height: 100%;
  box-sizing: border-box;

  .template-header {
    margin-bottom: $s-2;
  }
}
</style>
