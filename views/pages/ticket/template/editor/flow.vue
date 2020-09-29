<template>
  <div v-loading.fullscreen="submitting" class="flowchart-editor">
    <div class="flowchart-editor-wrap">
      <q-container>
        <q-header class="toolbar-wrap">
          <toolbar v-if="isEditorReady" class="toolbar" :graph="graph" />
        </q-header>
        <q-container>
          <q-aside class="node-panel-wrap">
            <node-panel />
          </q-aside>
          <q-main class="flowchart-wrap">
            <flowchart
              ref="flowchart"
              mode="edit"
              :data="flowChartData"
              :plugin-options="chartPlugins"
              @ready="handleReady"
              @node-click="handleNodeClick"
              @item-add="drawerReset"
              @item-remove="drawerReset"
              @item-state-change="handleStateChange"
              @error="handleError"
            />
          </q-main>
        </q-container>
      </q-container>

      <q-drawer
        ref="drawer"
        class="flow-chart-drawer"
        custom-class="flow-chart-drawer-content"
        title="节点配置"
        direction="rtl"
        size="100%"
        :wrapper-closable="false"
        :visible.sync="drawer.show"
        @closed="handleDrawerClosed"
      >
        <node-form
          v-if="drawer.data.id"
          :key="drawer.data.id"
          v-model="drawer.data"
          :condition-fields="conditionFields"
          :edges="drawer.edges"
          @input="handleNodeFormInput"
        />
      </q-drawer>
    </div>
    <q-button type="primary" @click="submit()">
      保存
    </q-button>
    <q-button v-if="!ticketTemplate.isUpdate" type="primary" @click="submit(true)">
      保存&amp;发布
    </q-button>
    <q-button @click="$router.back()">
      上一步
    </q-button>
  </div>
</template>

<script>
import { get, isNil, cloneDeep } from 'lodash';
import TicketNode from '@/services/ticket/models/ticket-node';
import TicketEdge from '@/services/ticket/models/ticket-edge';

import Flowchart, { Toolbar } from '@/packages/flowchart';
import NodePanel from '@/views/components/ticket/node-panel';
import NodeForm from  '@/views/components/ticket/node-form';
import { ITEM_STATE, ITEM_TYPE } from '@/packages/flowchart/constants';

export default {
  components: {
    Flowchart,
    Toolbar,
    NodePanel,
    NodeForm
  },
  props: {
    ticketTemplate: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  data() {
    return {
      flowChartData: {},
      conditionFields: [],

      isReady: false,
      isEditorReady: false,

      graph: null,
      chartPlugins: {
        minimap: {
          show: true
        },
        grid: {
          show: true
        }
      },

      // 节点配置抽屉
      drawer: {
        show: false,
        data: {},
        closeTimer: null,
        edges: []
      },

      submitting: false
    };
  },
  created () {
    if (isNil(this.ticketTemplate.info.key)) {
      this.$router.replace({
        name: 'template-editor-info'
      });
    }
    
    try {
      const contentSchema = this.ticketTemplate.contentSchema;
      const properties = get(JSON.parse(contentSchema), 'properties', '');
      this.conditionFields = Object.keys(properties).map(key => {
        return {
          key,
          name: get(properties, [key, 'title'], key) 
        };
      });
    } catch (error) {
      console.info(error);
    }
    this.flowChartData = this.ticketTemplate.flow.toJSON();
  },
  methods: {
    handleReady ({ graph }) {
      this.graph = graph;
      this.isEditorReady = true;
    },
    handleNodeClick (data) {
      const { drawer } = this;
      drawer.closeTimer && clearTimeout(drawer.closeTimer);
     
      // 拿到有关系的线
      const chartData = this.getChartData();
      drawer.edges = get(chartData, 'edges', []);
      drawer.data = cloneDeep(data);
      drawer.show = true;
    },
    handleStateChange ({ item, state, enabled }) {
      const type = item.get('type');
      if (type === ITEM_TYPE.NODE && state === ITEM_STATE.SELECTED && enabled === false) {
        this.drawerReset();
      }
    },
    handleError (error) {
      this.$message.error(error.message);
    },
    handleDrawerClosed () {
      this.$refs.flowchart.clearSelected();
    },
    drawerReset () {
      this.drawer.closeTimer = setTimeout(() => {
        this.drawer.show = false;
        this.drawer.data = {};
      }, 200);
    },
    handleNodeFormInput (value) {
      if (this.$refs.flowchart && this.drawer.show) {
        const {id, ...args} = value;
        this.$refs.flowchart.updateItem(id, args);
      }
    },
    getChartData () {
      return this.$refs.flowchart && this.$refs.flowchart.getData();
    },
    async submit (enable) {
      this.submitting = true;
      const chartData = this.getChartData();
      const { nodes, edges } = chartData;

      const { ticketTemplate } = this;
      if (enable) {
        ticketTemplate.updateData({
          info: { enable }
        });
      }

      ticketTemplate.flow.updateData({
        nodes: nodes.map(node => new TicketNode(node)),
        edges: edges.map(edge => new TicketEdge(edge))
      });

      try {
        await ticketTemplate.save();
        qp.feedback.showToast({
          type: 'success',
          message: '工单模板保存成功'
        });
        this.$router.replace({
          name: 'ticket-template'
        });
      } catch (error) {
        if (!error.isBizError) {
          qp.feedback.showToast({
            type: 'error',
            message: '工单模板保存失败，请重试'
          });
        } else {
          throw error;
        }
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.flowchart-editor-wrap {
  margin: $s-2 0;
  position: relative;
  border: $line-1 solid $color-fill1-2;
  overflow: hidden;

  .toolbar-wrap {
    height: auto !important;
  }

  .node-panel-wrap {
    width: $s-20 !important;
    border-right: $line-1 solid $color-line1-1;
  }

  .flowchart-wrap {
    overflow: hidden;
  }

  .node-panel,
  .toolbar {
    padding: $s-1;
  }

  .node-panel {
    height: 100%;
    display: flex;
    box-sizing: border-box;
    flex-direction: column;

    ::v-deep .node-item {
      margin-bottom: $s-1;
    }
  }
}

.flowchart {
  height: $s-50;
  margin: (-$line-1);
}

.flow-chart-drawer {
  position: absolute;
  left: auto;
  background: none;
  width: $s-40;
  padding-left: $s-4;
  box-sizing: border-box;
}
</style>

<style lang="scss">
.flow-chart-drawer {
  .q-drawer__container:focus {
    outline: none;
  }

  .q-drawer__body {
    padding: 0;
    overflow: auto;
  }
}
</style>
