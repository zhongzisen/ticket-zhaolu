<template>
  <div class="flow-chart-wrap">
    <flowchart
      ref="flowchart"
      :data="flowChartData"
      :plugin-options="chartPlugins"
      @ready="handleReady"
    />
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { findKey, get } from 'lodash';
import Flowchart from '@/packages/flowchart';
import Flow from '@/services/ticket/models/ticket-flow';

import { transformEnumKey } from '@/utils';

import { TICKET_NODE_STATUS_KEY, TICKET_NODE_STATUS_NAME, TICKET_NODE_RELATION_NAME, TICKET_NODE_CATEGORY, TICKET_APPROVAL_USER_TYPE_KEY } from '@/constants';

export default {
  name: 'TicketDetaileFlow',
  components: {
    Flowchart,
  },
  props: {
    ticketDetail: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  data () {
    const _this = this;
    return {
      graph: null,
      flowChartData: {},

      chartPlugins: {
        minimap: {
          show: true,
          size: [80, 40]
        },
        tooltip: {
          show: true,
          itemTypes: ['node'],
          getContent (evt) {
            const model = evt.item.getModel();
            const { nodes = [] } = _this.flowData;
            const currentNode = nodes.find(node => `node${node.id}` === model.id);

            if (!currentNode) return '获取节点信息异常';

            const { status } = currentNode;
            const statusName = TICKET_NODE_STATUS_NAME[transformEnumKey('TICKET_NODE_STATUS', status)];
            
            const outDiv = document.createElement('div');
            outDiv.className += ' flow-node-tooltip';
            outDiv.innerHTML = `
              <b>${ currentNode.name }</b>
              <span>${statusName}</span>
            `;

            // 节点关系显示
            const { relation, category } = get(model, 'extension', {});
            if (category !== TICKET_NODE_CATEGORY.START) {
              outDiv.innerHTML += `
                <div><b>激活规则</b> <span>${TICKET_NODE_RELATION_NAME[relation]}</span></div>
              `;
            }

            // 节点条件显示

            // 处理中的节点显示待处理角色和人
            if (TICKET_NODE_STATUS_KEY.PENDING === status) {
              const { roles } = currentNode;

              const approvalUsers = [];
              const approvalGroups = [];

              roles.forEach(role => {
                if (role.type === TICKET_APPROVAL_USER_TYPE_KEY.USER) {
                  const userInfo = get(_this, 'ticketDetail.users', []).find(user => user.id === role.id);
                  if (userInfo) approvalUsers.push(userInfo);
                } else {
                  const groupInfo = get(_this, 'ticketDetail.groups', []).find(({ group }) => group.id === role.id);
                  if (groupInfo) {
                    approvalGroups.push(groupInfo.group);
                    approvalUsers.push(...groupInfo.users);
                  }
                }
              });

              if (approvalGroups.length > 0) {
                const groups = approvalGroups.map(group => group.name);
                outDiv.innerHTML += `
                <div><b>审批角色</b> <span>${groups.join(', ')}</span></div>
                `;
              }

              if (approvalUsers.length > 0) {
                const users = approvalUsers.map(user => `${user.name} (${user.email || '-'})`);
                outDiv.innerHTML += `
                <div><b>审批人</b> <span>${users.join(', ')}</span></div>
                `;
              }
            }

            // 审批信息显示
            if (![TICKET_NODE_STATUS_KEY.PENDING, TICKET_NODE_STATUS_KEY.CREATED].includes(status)) {
              const userInfo = get(_this, 'ticketDetail.users', []).find(user => user.id === currentNode.approver);
              const modified = dayjs(currentNode.modified).format('YYYY-MM-DD HH:mm:ss');
            
              if (currentNode.approver) {
                outDiv.innerHTML += `
                <div><b>${ get(userInfo, 'name', '-') }</b> <span>${modified}</span></div>
              `;
              } else {
                outDiv.innerHTML += `
                  <div><b>系统</b> <span>${modified}</span></div>
                `;
              }
            }

            return outDiv;
          }
        }
      },
    };
  },
  computed: {
    flowData () {
      return get(this, 'ticketDetail.flow', {});
    }
  },
  created () {
    this.flowChartData = new Flow(null, this.flowData).toJSON();
  },
  methods: {
    handleReady () {
      // 设置节点状态及审批信息
      const { nodes } = this.flowData;
      nodes.forEach(node => {
        const { status } = node;
        const statusKey = findKey(TICKET_NODE_STATUS_KEY, (value) => value === status);
        this.$refs.flowchart && this.$refs.flowchart.setItemState(`node${node.id}`, statusKey.toLocaleLowerCase(), true);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.flow-chart-wrap {
  ::v-deep .flow-node-tooltip {
    line-height: 2;
  }

  ::v-deep .flowchart-node {
    padding-left: $s-4 - $size-small;
    background-image: url('~@/assets/images/icons/default.svg');
    background-repeat: no-repeat;
    background-position: $s-1 center;
    background-size: $s-2;
    border-color: $color-text1-2;

    &.pending,
    &.processing {
      background-image: url('~@/assets/images/icons/pending.svg');
      border-color: $color-brand1-3;
    }

    &.resolved {
      background-image: url('~@/assets/images/icons/resolved.svg');
      border-color: $color-success-9;
    }

    &.rejected {
      background-image: url('~@/assets/images/icons/rejected.svg');
      border-color: $color-error-5;
    }

    &.abnormal {
      background-image: url('~@/assets/images/icons/abnormal.svg');
      border-color: $color-warning-7;
    }

    &.hang {
      background-image: url('~@/assets/images/icons/hang.svg');
      border-color: $color-warning-7;
    }

    &.skip {
      background-image: url('~@/assets/images/icons/skip.svg');
      border-color: $color-success-9;
    }
  }
}

</style>
