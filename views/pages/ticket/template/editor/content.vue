<template>
  <div class="content-container-wrap">
    <div type="flex" class="content-container">
      <div class="content-config">
        <header class="content-header">
          配置内容
        </header>
        <codemirror v-model="contentSchemaStr" />
      </div>
      <div class="content-preview">
        <header class="content-header">
          内容预览
        </header>
        <dynamic-form
          v-if="handler"
          :handler="handler"
          @input="updateFormData"
        />
      </div>
    </div>
    <div class="button-container">
      <q-button type="primary" @click="submit">
        下一步
      </q-button>
      <q-button @click="$router.back()">
        上一步
      </q-button>
    </div>
  </div>
</template>

<script>
import { isEmpty, isNil, cloneDeep } from 'lodash';

import Codemirror from '@/views/components/codemirror';
import DynamicForm from '@/views/components/dynamic-form';
import { JsonSchemaHandler } from '@cbb/dynamic-form-json-schema';
import jsonSchemaExampleJson from '@/configs/json-schema-example.json';

export default {
  components: { 
    Codemirror,
    DynamicForm
  },
  props: {
    ticketTemplate: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  data() {
    return {
      contentSchemaStr: {},
      handler: null,
      perviewFormData: {}
    };
  },
  watch: {
    contentSchemaStr: {
      handler (value) {
        this.handler = new JsonSchemaHandler(JSON.parse(value));
      }
    }
  },
  created () {
    if (isNil(this.ticketTemplate.info.key)) {
      this.$router.replace({
        name: 'template-editor-info',
        params: this.$route.params
      });
    }

    if (!isEmpty(this.ticketTemplate.contentSchema)) {
      this.contentSchemaStr = cloneDeep(this.ticketTemplate.contentSchema);
    } else {
      this.contentSchemaStr = cloneDeep(JSON.stringify(jsonSchemaExampleJson, null, 2));
    }
    
  },
  methods: {
    updateFormData(value) {
      this.perviewFormData = value;
    },
    submit() {
      this.ticketTemplate.contentSchema = this.contentSchemaStr;
      this.$router.push({
        name: 'template-editor-flow',
        params: this.$route.params
      });
    },
  }
};
</script>
<style lang="scss" scoped>
.content-container-wrap {
  .content-container {
    height: $s-65;
    border: $line-1 solid $color-fill1-2;
    display: flex;
  }

  .content-header {
    background: $color-fill1-2;
    font-size: $font-size-body-2;
    padding: $size-base;
  }

  .content-config {
    display: flex;
    flex-direction: column;
    width: 60%;
    border-right: $line-1 solid $color-white;
  }

  .content-preview {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;
  }

  .button-container {
    margin: $s-2 0 0;
  }

  ::v-deep .q-form {
    flex: 1;
    overflow: auto;
    padding: $s-2;

    .q-select {
      width: 100%;
    }
  }
}
</style>
