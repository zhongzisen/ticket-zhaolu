<template>
  <div v-if="initialized" ref="flowchart-toolbar" class="flowchart-toolbar">
    <template v-for="(item, index) in commandMap">
      <q-button
        v-if="item.type === COMMAND_TYPE.BUTTON"
        :key="index"
        class="command"
        size="mini"
        round
        @click="handleClick(item)"
      >
        {{ item.text }}
      </q-button>
      <div v-if="item.type === COMMAND_TYPE.SPLIT" :key="index" class="split" />
    </template>
  </div>
</template>

<script>
import pluginBase from './plugin-base';

const COMMAND_TYPE = {
  BUTTON: 'button',
  SPLIT: 'split'
};

const commandMap = [
  {
    type: COMMAND_TYPE.BUTTON,
    command: 'undo',
    text: '撤销',
  }, {
    type: COMMAND_TYPE.BUTTON,
    command: 'redo',
    text: '重做'
  }, {
    type: COMMAND_TYPE.SPLIT
  }, {
    type: COMMAND_TYPE.BUTTON,
    command: 'zoomIn',
    text: '缩小'
  }, {
    type: COMMAND_TYPE.BUTTON,
    command: 'zoomOut',
    text: '放大'
  }, {
    type: COMMAND_TYPE.BUTTON,
    command: 'autoZoom',
    text: '自适应'
  }, {
    type: COMMAND_TYPE.BUTTON,
    command: 'resetZoom',
    text: '实际尺寸'
  }, {
    type: COMMAND_TYPE.BUTTON,
    command: 'autoLayout',
    text: '自动排列'
  }
];

export default {
  name: 'FlowchartToolbar',
  mixins: [pluginBase],
  data () {
    return {
      COMMAND_TYPE,
      commandMap,
      commander: null
    };
  },
  methods: {
    install () {
      const { graph } = this;
      this.commander = graph.commander;
    },
    handleClick (item) {
      const { command } = item;
      this.commander[command] && this.commander[command]();
    }
  }
};
</script>

<style lang="scss">
.flowchart-toolbar-system {
  display: none;
}

.flowchart-toolbar {
  height: $s-4;
  display: flex;
  align-items: center;
  border-bottom: $line-1 solid $color-fill1-2;
  padding: $size-small 0;

  .split {
    width: $size-base;
    height: 100%;
    border-right: $line-1 solid $color-fill1-2;
    margin-right: $size-base;
  }

  .pull-right {
    display: flex;
    align-items: center;
    margin-left: auto;
  }

  .command {
    display: flex;

    &:hover {
      color: #1890ff;
    }
  }
}
</style>
