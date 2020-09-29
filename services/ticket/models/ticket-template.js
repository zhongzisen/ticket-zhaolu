
import { get, set, merge, cloneDeep, isNil } from 'lodash';
import TicketFlow from './ticket-flow';

import ticketApi from '@/services/api';
export default class TicketTemplate {
  // 基本信息
  info = {
    id: NaN,

    key: '',

    name: '',

    type: '',

    tag: '',

    description: '',

    enable: false,

    config: {},

    metadata: {}
  }

  // 内容描述
  contentSchema = '';

  // 流程信息
  flow = new TicketFlow();

  get isUpdate () {
    return !isNaN(this.info.id);
  }

  constructor (data) {
    if (!isNil(data)) {
      const { key, template, flow } = data;
      
      this.updateData({
        info: template,
        contentSchema: get(template, 'config.jsonschema', get(template, 'config.contentSchema')),
        flow: new TicketFlow(key, flow)
      });
    }
  }

  async fetch (key) {
    const { template, flow } = await ticketApi.apiV1TemplateKeyGet({ key });
    this.updateData({
      info: template,
      contentSchema: get(template, 'config.jsonschema', get(template, 'config.contentSchema')),
      flow: new TicketFlow(key, flow)
    });
  }

  updateData(data = {}) {
    merge(this, data);
  }

  async save () {
    const data = cloneDeep(this.info);
    set(data, 'config.contentSchema', this.contentSchema);
    
    if (!this.isUpdate) {
      await ticketApi.apiV1TemplatesPost({
        data
      });
    } else {
      await ticketApi.apiV1TemplateKeyPost({
        key: data.key,
        data
      });
    }
    await this.saveFlow();
  }

  async saveFlow () {
    const data = cloneDeep(this.info);

    try {
      const flow = this.flow.toBizData();
      const apiMethod = this.isUpdate ? 'apiV1TemplateKeyFlowPatchPost' : 'apiV1TemplateKeyFlowPost';
      await ticketApi[apiMethod]({
        key: data.key,
        data: {
          key: data.key,
          flow
        }
      });
    } catch (error) {
      // 流程创建失败，删除已保存模板
      if (!this.isUpdate) await ticketApi.apiV1TemplateKeyDelete({ key: data.key });
      throw error;
    }
  }
}
