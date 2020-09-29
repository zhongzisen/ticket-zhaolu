<template>
  <div class="ticket-node-form">
    <div v-if="!nodeModel.id">
      节点信息不正确
    </div>
    <q-form
      v-else-if="isReady"
      :model="nodeModel"
      label-position="top"
      @keydown.native.stop
    >
      <q-collapse v-model="nodeCollapsed" class="node-collapse">
        <q-collapse-item class="node-collapse-item" title="基本信息" name="info">
          <q-form-item label="节点名称">
            <q-input v-model="nodeModel.name" placeholder="请输入节点名称" autocomplete="off" />
          </q-form-item>

          <q-form-item v-if="nodeModel.nodeType === NODE_TYPE.NORMAL" label="节点审批规则">
            <q-input v-model="nodeModel.extension.metadata.approvalRules" placeholder="请输获取审批人规则" autocomplete="off" />
          </q-form-item>
        </q-collapse-item>

        <q-collapse-item v-if="nodeModel.nodeType !== NODE_TYPE.START" title="节点关系" name="relation">
          <q-form-item label="节点关系类型">
            <q-select
              v-model="nodeModel.extension.relation"
              :disabled="!hasMultipleSource"
              placeholder="请选择节点关系类型"
            >
              <q-option
                v-for="(relation, key) in TICKET_NODE_RELATION"
                :key="key"
                :disabled="relation === TICKET_NODE_RELATION.NORMAL"
                :label="TICKET_NODE_RELATION_NAME[relation]"
                :value="relation"
              />
            </q-select>
          </q-form-item>

          <q-form-item v-if="nodeModel.nodeType !== NODE_TYPE.END" label="节点条件">
            <q-row
              v-for="(condition, index) in nodeModel.extension.conditions"
              :key="nodeModel.id + index"
              class="node-condition"
              type="flex"
            >
              <q-select
                :value="condition.field"
                placeholder="字段"
                size="mini" 
                @input="handleConditonFieldChange(condition, ...arguments)"
              >
                <q-option
                  v-for="field in conditionFields"
                  :key="field.key"
                  :label="field.name"
                  :value="field.key"
                />
              </q-select>

              <q-select
                v-model="condition.operator"
                class="condition-operator"
                placeholder="操作" 
                size="mini"
              >
                <q-option
                  v-for="(operator, key) in TICKET_NODE_CONDITION_OPERATOR"
                  :key="key"
                  :label="TICKET_NODE_CONDITION_OPERATOR_NAME[operator]"
                  :value="operator"
                />
              </q-select>

              <q-input
                v-model="condition.value"
                class="condition-value"
                size="mini"
                placeholder="值"
              />

              <i class="q-icon-delete" @click.prevent="nodeModel.removeConditionItem(index)" />
            </q-row>

            <q-button :disabled="nodeModel.nodeType !== NODE_TYPE.NORMAL" size="mini" @click.prevent="nodeModel.addConditionItem">
              添加
            </q-button>
          </q-form-item>
        </q-collapse-item>
      </q-collapse>
    </q-form>
  </div>
</template>

<script>
import TicketNode from '@/services/ticket/models/ticket-node';

import { NODE_TYPE } from '@/packages/flowchart/constants';

import { TICKET_NODE_RELATION, 
  TICKET_NODE_RELATION_NAME,
  TICKET_NODE_CONDITION_OPERATOR,
  TICKET_NODE_CONDITION_OPERATOR_NAME } from '@/constants';

export default {
  props: {
    value: {
      type: Object,
      default () {
        return {};
      }
    },
    edges: {
      type: Array,
      default () {
        return [];
      }
    },
    conditionFields: {
      type: Array,
      default () {
        return [];
      }
    },
  },
  data() {
    return {
      NODE_TYPE,
      TICKET_NODE_RELATION,
      TICKET_NODE_CONDITION_OPERATOR,
      TICKET_NODE_RELATION_NAME,
      TICKET_NODE_CONDITION_OPERATOR_NAME,

      nodeCollapsed: ['info', 'relation'],

      nodeModel: new TicketNode(),
      isReady: false
    };
  },
  computed: {
    // 是否存在多条不同源的连线
    hasMultipleSource () {
      const edges = this.edges.filter(edge => edge.target === this.nodeModel.id);
      return edges.length > 1;
    }
  },
  watch: {
    nodeModel: {
      deep: true,
      handler () {
        if (this.isReady) this.$emit('input', this.nodeModel.toJSON());
      }
    },
  },
  mounted () {
    const defaultNode = new TicketNode();
    defaultNode.updateData(this.value);
    this.nodeModel = defaultNode;

    defaultNode.updateData({ 
      extension: {
        relation: this.hasMultipleSource ? TICKET_NODE_RELATION.JOIN_AND : TICKET_NODE_RELATION.NORMAL
      } 
    });
    this.$emit('input', defaultNode.toJSON());

    this.nodeModel = defaultNode;

    this.$nextTick(() => {
      this.isReady = true;
    });
  },
  methods: {
    handleConditonFieldChange (condition, value) {
      const currentField = this.conditionFields.find(field => field.key === value);
      condition.field = value;
      condition.name = currentField.name;
    }
  },
};
</script>

<style lang="scss" scoped>
.ticket-node-form {
  .q-select {
    width: 100%;
  }

  .node-collapse {
    border: none;
    border-radius: 0;

    ::v-deep .q-collapse-item {
      & > div {
        border: none;
      }
    }
  }

  .node-condition {
    margin: 0 (-$size-small) $size-base;
    align-items: center;

    ::v-deep .q-select,
    ::v-deep .q-input,
    ::v-deep .q-icon-delete {
      margin: 0 $size-small;

      &.condition-operator {
        width: $s-25;
      }

      &.condition-value {
        width: $s-25;
      }
    }

    ::v-deep .q-icon-delete {
      cursor: pointer;
      font-size: $font-size-body-2;

      &:hover {
        color: $color-error-4;
      }
    }
  }
}
</style>
