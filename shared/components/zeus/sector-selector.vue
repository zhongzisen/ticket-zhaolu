<template>
  <sector-select
    class="sector-select"
    v-bind="$attrs"
    :selected-sector-id="department"
    @update:selectedSectorId="change"
  />
</template>

<script>
import emitter from '@atsfe/qaxd/src/mixins/emitter';
import { SectorSelect, userService } from '@cbb/zeus';

export default {
  components: { SectorSelect },
  mixins: [emitter],
  model: {
    prop: 'departmentId',
    event: 'change'
  },
  props: {
    departmentId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      assetId: null,
      department: null
    };
  },
  watch: {
    departmentId: {
      immediate: true,
      handler() {
        this.generateDepartment();
      }
    },
    assetId() {
      this.generateDepartment();
    }
  },
  async created() {
    this.assetId = await userService.getAssetId();
  },
  methods: {
    generateDepartment() {
      if (!this.assetId || this.departmentId === '') {
        return;
      }
      this.department = {
        oid: this.assetId.oid,
        id: this.departmentId,
        assetId: this.assetId
      };
    },
    change(department) {
      this.$emit('change', department.id.toString());
      this.dispatch('QFormItem', 'el.form.change', department.id.toString());
    }
  }
};
</script>

<style lang="scss">
.zeus-sector-select.sector-select {
  display: inline-flex;
  align-items: center;
  width: 100%;
  height: $s-4;
  line-height: $s-4;
  max-width: $s-50;
  vertical-align: middle;

  .sectors-block {
    height: 100%;
  }

  .node-item-name {
    padding: 0;
  }
}
</style>
