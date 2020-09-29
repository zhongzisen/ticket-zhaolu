<template>
  <div class="layout-panel">
    <div class="layout-panel__title">
      {{ title }}
    </div>
    <div class="layout-panel__main">
      <slot name="default" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'LayoutPanel',
  props: {
    title: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="scss" scoped>
  .layout-panel {
    &__title {
      font-size: $font-size-title;
      margin-bottom: $s-2;
    }
  }
</style>
