<template>
  <staff-select
    v-model="staffList"
    class="staff-select"
    v-bind="$attrs"
    @change="change"
  />
</template>

<script>
import emitter from '@atsfe/qaxd/src/mixins/emitter';
import { StaffSelect, getApi, userService } from '@cbb/zeus';

export default {
  components: { StaffSelect },
  mixins: [emitter],
  model: {
    prop: 'staffIds',
    event: 'change'
  },
  props: {
    staffIds: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      assetId: null,
      staffList: []
    };
  },
  watch: {
    staffIds: {
      immediate: true,
      handler() {
        this.generateStaffList();
      }
    },
    assetId() {
      this.generateStaffList();
    }
  },
  async created() {
    this.assetId = await userService.getAssetId();
  },
  methods: {
    async getStaffMetasByStaffIds(staffIds) {
      const { metas: batchStaffMetaResponses } = await getApi().staff.batchGetStaffMeta({
        staffs: staffIds.map(staffId => ({ staff: staffId }))
      }).toPromise();
      const staffMetas = batchStaffMetaResponses.map(({ meta: staffMeta }) => staffMeta);
      return staffMetas;
    },
    async generateStaffList() {
      if (this.staffIds.length === 0 || !this.assetId) {
        return;
      }
      const staffList = [];
      const staffIds = this.staffIds.map(id => ({
        id,
        assetId: this.assetId
      }));
      const staffMeta = await this.getStaffMetasByStaffIds(staffIds);
      staffIds.forEach((staff, index) => {
        if (staffMeta[index]) {
          staffList.push({ label: staffMeta[index].realName, value: staff });
        }
      });
      this.staffList = staffList;
    },
    change() {
      const staffIds = this.staffList.map(item => item.value.id.toString());
      this.$emit('change', staffIds);
      this.dispatch('QFormItem', 'el.form.change', staffIds);
    }
  }
};
</script>

<style lang="scss">
.zeus-staff-select.staff-select {
  display: inline-flex;
  align-items: center;
  width: 100%;
  max-width: $s-50;
  height: $s-4;
  line-height: $s-4;
  padding: 0 $size-small;
  vertical-align: middle;

  .q-tag {
    margin-right: $size-small;
  }
}
</style>
