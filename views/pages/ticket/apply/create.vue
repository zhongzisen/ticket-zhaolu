<template>
  <div class="create-container">
    <q-page-header class="header" :content="templateDetail.name" @back="() => $router.go(-1)" />

    <dynamic-form
      ref="formComponent"
      v-model="formData"
      :handler="handler"
      class="form-component"
    />
    
    <div v-if="!loading" class="button-container">
      <q-button type="primary" @click="handleSubmit">
        确定
      </q-button>
      <q-button @click="$router.go(-1)">
        取消
      </q-button>
    </div>
  </div>
</template>
<script>
import ticketApi from '@/services/api';
import DynamicForm from '@/views/components/dynamic-form'; 
import { JsonSchemaHandler } from '@cbb/dynamic-form-json-schema';

export default {
  components: {
    DynamicForm
  },
  data() {
    return {
      loading: false,
      templateDetail: {},

      handler: null,
      formData: {}
    };
  },
  computed: {
    templateKey () {
      return this.$route.params.templateKey;
    },
    fromTicketId () {
      return this.$route.query.from;
    }
  },
  async created() {
    this.loading = true;
    await this.initTicketTemplate();
    // 重新发起逻辑
    try {
      if (this.fromTicketId) this.initFromTicketInfo();
    } catch (error) {
      console.error(error);
    }
    this.loading = false;
  },
  methods: {
    async initTicketTemplate() {
      const { template } = await ticketApi.apiV1TemplateKeyGet({
        key: this.templateKey
      });
      this.templateDetail = template;
      this.handler = new JsonSchemaHandler(JSON.parse(template.config.contentSchema));
    },
    async initFromTicketInfo () {
      const { template_key: key, data } = await ticketApi.apiV1TicketIdGet({
        id: this.fromTicketId
      });

      if (key === this.templateKey) {
        Object.keys(this.formData).forEach(key => {
          if (key in data) this.formData[key] = data[key];
        });
      }
    },
    async handleSubmit() {
      if (await this.$refs.formComponent.validate()) {
        await qp.errorHandling.catchError(async () => {
          await ticketApi.apiV1TicketsPost({
            data: {
              template_key: this.templateKey,
              data: this.formData
            }
          });

          qp.feedback.showToast({
            type: 'success',
            message: '工单创建成功'
          });

          this.$router.push({
            name: 'ticket-list'
          });
        }, (error, event) => {
          let message = '工单创建失败';
          if (error.isBizError) message = error.message;

          qp.feedback.showToast({
            type: 'error',
            message
          });
          event.stopPropagation();
        });
      } else {
        return false;
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.create-container {
  .header {
    margin-bottom: $s-2;
  }

  .form-component {
    margin: 0 $s-8;
    max-width: 60%;
  }

  ::v-deep .q-select {
    width: 100%;
  }

  .button-container {
    margin-top: $s-2;
  }
}
</style>
