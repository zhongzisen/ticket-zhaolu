<template>
  <div class="node-panel">
    <div
      v-for="(node, index) in nodes"
      :key="index"
      class="node-item"
      draggable="true"
      @dragstart="handleDrag(node, $event)"
    >
      <slot name="node-item" :node="node">
        {{ node.name }}
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FlowchartNodePanel',
  props: {
    nodes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      drag: false
    };
  },
  methods: {
    handleDrag (node, ev) {
      ev.dataTransfer.effectAllowed = 'copy';
      ev.dataTransfer.setData('text/plain', JSON.stringify(node));
    }
  },
};
</script>

<style lang="scss">
.node-panel {
  padding: $size-base 0;
  margin: 0 (-$size-small);
  display: flex;

  .node-item {
    margin: 0 $size-small;
    background: $color-fill1-2;
    padding: $size-base;
    font-size: $font-size-body-1;
    user-select: none;
  }
}
</style>
