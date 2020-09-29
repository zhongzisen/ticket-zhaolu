<template>
  <div class="form-area">
    <q-row>
      <q-col :span="12" :offset="6">
        <q-form
          ref="form"
          :model="formData"
          :rules="rules"
          label-width="80px"
          label-position="right"
        >
          <q-form-item label="模板名称" prop="name">
            <q-input v-model="formData.name" placeholder="请填写模板名称" />
          </q-form-item>

          <q-form-item label="模板标识" prop="key">
            <q-input v-model="formData.key" :disabled="ticketTemplate.isUpdate" placeholder="请填写模板标识" />
          </q-form-item>

          <q-form-item label="模板类别" prop="type">
            <q-select
              v-model="formData.type"
              placeholder="请选择模板类别"
              size="small"
              style="width: 100%;"
            >
              <q-option
                v-for="item in templateTypeOptions"
                :key="item.type"
                :label="item.name"
                :value="item.type"
              />
            </q-select>
          </q-form-item>

          <q-form-item label="描述" class="margin-top" prop="description">
            <q-input
              v-model="formData.description"
              :rows="4"
              type="textarea"
              placeholder="请输入模板描述"
            />
          </q-form-item>

          <q-form-item class="margin-top">
            <q-button type="primary" @click="submit">
              下一步
            </q-button>
            <q-button @click="handleCancel">
              取消
            </q-button>
          </q-form-item>
        </q-form>
      </q-col>
    </q-row>
  </div>
</template>

<script>
import ticketApi from '@/services/api';
import { cloneDeep } from 'lodash';
export default {
  props: {
    ticketTemplate: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  data() {
    var checkName = (rule, value, callback) => {
      const reg = /[\u4e00-\u9fa5a-zA-Z0-9_]{3,20}$/;
      if (!reg.test(value)) {
        callback(new Error('模板名只汉子由字母、数字、下划线组成, 并且以字母开头，长度3-20位'));
      } else {
        callback();
      }
    };
    var checkKey = (rule, value, callback) => {
      const reg = /^[a-zA-Z][a-zA-Z0-9_]{3,8}$/;
      if (!reg.test(value)) {
        callback(new Error('模板标识只由字母、数字、下划线组成, 并且以字母开头，长度3-8位'));
      } else {
        callback();
      }
    };
    return {
      rules: {
        type: [
          {required: true, message: '请选择模板类别', trigger: 'change'}
        ],
        name: [
          { required: true, message: '请输入模板名称', trigger: 'blur' },
          { validator: checkName, trigger: 'blur'}
        ],
        key: [
          { required: true, message: '请输入模板标识', trigger: 'blur' },
          { validator: checkKey, trigger: 'blur'}
        ],
        description: [
          { message: '模板描述不超过255字符', trigger: 'blur', max: 255 },
        ]
      },
      formData: {
        type: '',
        name: '',
        key: '',
        description: ''
      },

      templateTypeOptions: []
    };
  },
  created() {
    this.getTemplateTypeOptions();
    this.formData = cloneDeep(this.ticketTemplate.info);
  },
  methods: {
    async getTemplateTypeOptions() {
      const { templateType } = await ticketApi.apiV1TemplatesTypeGet();
      this.templateTypeOptions = templateType;
    },
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          // 检查当前Key是否存在
          try {
            if (!this.ticketTemplate.isUpdate) { // 更新情况下不校验
              await ticketApi.apiV1TemplateKeyGet({
                key: this.formData.key
              });
              qp.feedback.showToast({
                type: 'error',
                message: '模板标识已存在，请重新输入'
              });
            } else {
              this.goNext();
            }
          } catch (error) {
            this.ticketTemplate.info = Object.assign({}, this.ticketTemplate.info, this.formData);
            this.goNext();
          }

        }
      });
    },
    goNext () {
      this.$router.push({
        name: 'template-editor-content',
        params: this.$route.params
      });
    },
    handleCancel() {
      this.$router.push({
        name: 'ticket-template'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.form-area {
  margin-top: $s-4;

  p {
    font-size: $font-size-body-1;
  }

  .margin-top {
    margin-top: $s-4;
  }
}
</style>
