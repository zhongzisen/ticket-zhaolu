<template>
  <div class="apply-container">
    <div
      v-for="(item, templatesIndex) in templates"
      v-show="item.templates.length !== 0"
      :key="templatesIndex"
      class="typeContainer"
    >
      <q-row>
        <q-col :span="4" :offset="1">
          <q-tag size="medium" type="primary">
            {{ item.name }}
          </q-tag>
        </q-col>
        <q-col :span="16">
          <q-tooltip
            v-for="(template, templateIndex) in item.templates"
            :key="templateIndex"
            :disabled="template.description === ''"
            placement="top"
            effect="light"
          >
            <div slot="content">
              {{ template.description }}
            </div>
            <q-button :data-key="template.key" @click="handleClick($event)">
              {{ template.name }}
            </q-button>
          </q-tooltip>
        </q-col>
      </q-row>
    </div>
  </div>
</template>

<script>
import ticketApi from '@/services/api';
export default {
  name: 'TicketApply',
  data() {
    return {
      templates: []
    };
  },
  created() {
    this.getTemplateList();
  },
  methods: {
    async getTemplateList() {
      const payload = {};
      Promise.all([ticketApi.apiV1TemplatesGet(payload), ticketApi.apiV1TemplatesTypeGet(payload)])
        .then(values => {
          this.formatData(values[0].templates, values[1].templateType);
        });
    },
    formatData(templates, templateType) {
      const list = [];
      templateType.forEach(item => {
        list.push({
          name: item.name,
          type: item.type,
          description: item.description,
          templates: templates.filter(template => template.type === item.type && template.enable)
        });
      });
      this.templates = list;
    },
    handleClick(e) {
      this.$router.push({
        name: 'ticket-create',
        params: {
          templateKey: e.currentTarget.getAttribute('data-key')
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.apply-container {
  height: 100%;
  min-width: 1000px;

  .q-tag,
  .q-button {
    text-align: center;
    min-width: $s-9;
    margin-top: $s-3;
    margin-left: $s-1;
  }

  .typeContainer {
    margin-top: $s-5;
  }
}
</style>
