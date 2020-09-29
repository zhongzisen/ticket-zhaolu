<template>
  <div ref="flowchart" class="flowchart" />
</template>

<script>
import G6 from '@antv/g6/lib';
import events from '../events';
import Commander from '../commander';
import { cloneDeep, set, get, debounce, isNil } from 'lodash';
import { FLOWCHART_MODE, NODE_ANCHOR_TYPE, NODE_ANCHOR_INDEX, ITEM_TYPE, NODE_TYPE, ERROR_CODES } from '../constants';

import defaultConfig from '../configs';
import behaviors from '../behaviors';
import plugins from '../plugins';

export default {
  name: 'Flowchart',
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      }
    },
    mode: {
      type: String,
      default: FLOWCHART_MODE.READONLY
    },
    graphOptions: {
      type: Object,
      default: () => {
        return {};
      }
    },
    pluginOptions: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      graph: null,
      ready: false
    };
  },
  computed: {
    currentData () {
      const data = cloneDeep(this.data);
      data.nodes = get(data, 'nodes', []).map(node => {
        node.mode = this.mode;
        return node;
      });
      data.edges = get(data, 'edges', []).map(edge => {
        edge.sourceAnchor = NODE_ANCHOR_INDEX[NODE_ANCHOR_TYPE.OUT];
        edge.targetAnchor = NODE_ANCHOR_INDEX[NODE_ANCHOR_TYPE.IN];
        return edge;
      });
      return data;
    }
  },
  mounted () {
    this.initGraph();
    this.initPlugins();
    this.initListener();
    this.$emit('ready', { graph: this.graph });
  },
  beforeDestroy () {
    // this.graph && this.graph.destroy();
    // this.graph = null;
  },
  methods: {
    initGraph () {
      const { container, width, height } = this.getContainerInfo();

      const configs = cloneDeep(defaultConfig);
      // 设置 mode 对应的 behaviors
      Object.values(FLOWCHART_MODE).forEach(mode => {
        set(configs, ['modes', mode], [
          ...get(configs, ['modes', mode], []),
          ...get(behaviors, [mode], [])
        ]);
      });

      const options = {
        container,
        width,
        height,
        ...configs
      };

      const graph = new G6.Graph(options);
      const commander = new Commander(graph);
      graph.commander = commander;
      graph.data(this.currentData);
      graph.render();

      this.initPatch(graph);

      // 设置模式
      graph.setMode(this.mode);
      commander.autoLayout();
      this.graph = graph;
      this.ready = true;
    },
    initPlugins () {
      const { pluginOptions, graph } = this;
      Object.keys(pluginOptions).forEach(key => {
        if (get(pluginOptions, [key, 'show']) === true && get(plugins, [key, 'install'])) {
          plugins[key].install({ graph, options: get(pluginOptions, [key]) });
        }
      });
    },
    initListener () {
      const { graph }  = this;

      // 点击事件
      const handleItemClick = (ev) => {
        const item = ev.item;
        const id = item.get('id');
        const type = item.get('type');
        const data = get(this.getData(), `${type}s`, []);
        const currentData = data.find(d => d.id === id);
        this.$emit(`${type}-click`, currentData, item);
      };

      graph.on('node:click', handleItemClick);
      graph.on('edge:click', handleItemClick);

      // 窗口变化
      const handleResize = debounce(() => {
        const { width, height } = this.getContainerInfo();
        graph.changeSize(width, height);
        graph.refresh();
      }, 100);

      window.addEventListener('resize', handleResize);

      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener('resize', handleResize);
      });

      // 添加 item
      graph.on('afteradditem', (...args) => {
        this.$emit('item-add', ...args);
      });

      // 移除 item
      graph.on('afterremoveitem', (...args) => {
        this.$emit('item-remove', ...args);
      });

      // 状态变更
      graph.on('afteritemstatechange', (...args) => {
        this.$emit('item-state-change', ...args);
      });

    },

    initPatch (graph) {

      // 增加item时，进行节点类型校验
      const addItem = graph.addItem.bind(graph);
      graph.addItem = (type, model = {}, stack = true) => {
        if (type === ITEM_TYPE.NODE) {
          // 检查节点类型
          const { nodeType } = model;
          if (isNil(nodeType) || !Object.values(NODE_TYPE).includes(nodeType)) {
            return this.throwError(100001);
          }
          const startNode = graph.findAll(ITEM_TYPE.NODE, (node) => {
            return node.get('model').nodeType === NODE_TYPE.START;
          });

          if (nodeType === NODE_TYPE.START && startNode.length > 0) {
            this.throwError(100002);
            return;
          }

          const endNode = graph.findAll(ITEM_TYPE.NODE, (node) => {
            return node.get('model').nodeType === NODE_TYPE.END;
          });

          if (nodeType === NODE_TYPE.END && endNode.length > 0) {
            return this.throwError(100003);
          }
        }
        
        return addItem(type, model, stack);
      };
    },

    throwError(code) {
      const error = new Error(ERROR_CODES[code]);
      error.code = code;
      console.error(error);
      this.$emit('error', error);
      return error;
    },

    getContainerInfo () {
      const container = this.$refs.flowchart;
      const clientRects = container.getClientRects();
      
      return {
        container,
        width: get(clientRects, '0.width', 800),
        height: get(clientRects, '0.height', 400)
      };
    },
    
    // method
    addItem (type, data, stack) {
      this.graph && this.graph.addItem(type, data, stack);
    },

    updateItem (item, data, stack) {
      this.graph && this.graph.updateItem(item, data, stack);
    },

    setItemState(item, state, value) {
      this.graph && this.graph.setItemState(item, state, value);
    },

    clearSelected () {
      events.emit('item-state-clear');
    },

    getData () {
      const keys = ['id', 'name', 'label', 'extension', 'nodeType', 'source', 'target'];
      const chartData = this.graph.save();
      const data = {};

      Object.keys(chartData).forEach(key => {
        const items = chartData[key];

        data[key] = items.map(item => {
          const json = {};
          Object.keys(item).forEach(itemKey => {
            if (keys.includes(itemKey)) {
              json[itemKey] = item[itemKey];
            }
          });
          return json;
        });
      });

      return data;
    }
  },
};
</script>

<style lang="scss">
.flowchart {
  height: 100%;
  position: relative;

  .g6-grid-container {
    z-index: 0 !important;
  }

  & > svg,
  & > canvas {
    position: relative;
    z-index: 1;
  }
}

.flowchart-node {
  position: relative;
  font-size: $font-size-body-1;
  background: $color-white;
  border: $color-fill1-4 $line-1 solid;
  display: flex;
  align-items: center;
  padding: 0 $size-base;
  box-sizing: border-box;
  user-select: none;
  border-radius: $corner-1;

  span {
    display: block;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &.activated,
  &.selected {
    color: $color-brand1-4;
    border: $color-brand1-2 $line-1 solid;
  }

  &.selected {
    border: $color-brand1-2 $line-1 solid;
    background: $color-brand1-4;
    color: $color-white;
  }
}

.g6-minimap {
  background: rgba($color: $color-white, $alpha: 0.8);
  position: absolute;
  bottom: $size-base;
  left: $size-base;
  border: $color-fill1-2 $line-1 solid;
  z-index: 9;

  .g6-minimap-viewport {
    border-color: $color-brand1-2 !important;
  }
}

.g6-component-tooltip {
  z-index: 9;
}
</style>
