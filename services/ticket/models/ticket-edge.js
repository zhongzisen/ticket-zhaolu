import { cloneDeep, mergeWith } from 'lodash';
import { extractNumberFromString } from '@/utils';
import { TICKET_NODE_RELATION } from '@/constants';

export default class TicketEdge {
  // 源节点Id;
  source = '';

  // 目标节点Id
  target = '';

  // 扩展字段
  extension = {
    // 源节点Id
    start: '',

    // 目标节点Id
    end: '',

    // 进入节点关系
    relation: TICKET_NODE_RELATION.NORMAL,

    // 节点条件
    conditions: []
  }

  constructor (data) {
    this.updateData(data);
  }

  toBizData () {
    const { source, target, extension } = this;
    const { relation, conditions } = extension;

    this.updateData({
      extension: {start: source, end: target}
    });

    return {
      start: extractNumberFromString(source)[0],
      end: extractNumberFromString(target)[0], 
      type: relation, 
      conds: conditions,
      metadata: {
        uiConfigs: JSON.stringify(this.toJSON())
      }
    };
  }

  updateData (data = {}) {
    mergeWith(this, data, (objValue, srcValue) => {
      if (Array.isArray(objValue)) {
        return srcValue;
      }
    });
  }

  toJSON () {
    const { source, target, extension } = this;
    return cloneDeep({ source, target, extension });
  }
}
