<template>
  <div class="template-editor">
    <q-steps :active="active" align-center>
      <q-step title="填写基础信息" />
      <q-step title="配置工单内容" />
      <q-step title="配置工单流程" />
    </q-steps>

    <router-view v-if="isReady" :ticket-template="ticketTemplate" />
  </div>
</template>

<script>
import { get } from 'lodash';
import TicketTemplate from '@/services/ticket/models/ticket-template';

const EDITOR_PAGES = ['template-editor-info', 'template-editor-content', 'template-editor-flow'];

export default {
  data() {
    return {
      ticketTemplate: null,
      isReady: false
    };
  },
  computed: {
    active () {
      return EDITOR_PAGES.findIndex(name => name === this.$route.name);
    }
  },
  created () {
    this.initTemplate();
  },
  methods: {
    async initTemplate () {
      const key = get(this, '$route.params.key');
      const ticketTemplate = new TicketTemplate();
      if (key) {
        await ticketTemplate.fetch(key);
      }

      this.isReady = true;
      this.ticketTemplate = ticketTemplate;
    }
  },
};
</script>

<style lang="scss" scoped>
.template-editor {
  ::v-deep .q-steps {
    margin: $s-3;
  }
}
</style>
