import { cloneDeep, mergeWith } from 'lodash';
import { extractNumberFromString } from '@/utils';
import { TICKET_NODE_TYPE, TICKET_NODE_CATEGORY, TICKET_NODE_RELATION, TICKET_NODE_CATEGORY_NAME } from '@/constants';
import { NODE_TYPE } from '@/packages/flowchart/constants';

export default class TicketNode {
  // 节点ID
  id = null;

  // 节点名称
  name = '节点名称';

  // 节点图表类型
  nodeType = NODE_TYPE.NORMAL;

  // 扩展字段
  extension = {
    id: '',
    // 标签
    label: TICKET_NODE_CATEGORY_NAME[TICKET_NODE_CATEGORY.APPROVE],

    // 节点类型
    type: TICKET_NODE_TYPE.DYNAMIC,
  
    // 节点分类
    category: TICKET_NODE_CATEGORY.APPROVE,

    // 扩展字段
    metadata: {
      approvalRules: ''
    },

    // 进入节点关系
    relation: TICKET_NODE_RELATION.NORMAL,

    // 节点条件
    conditions: []
  }

  constructor (data) {
    this.updateData(data);
  }

  toBizData () {
    const { id, name, extension } = this;
    const { type, category, metadata } = extension;

    this.updateData({
      extension: { id }
    });

    return {
      id: extractNumberFromString(id)[0],
      name,
      type: category === TICKET_NODE_CATEGORY.APPROVE ? type : undefined,
      category,
      metadata: {
        ...metadata,
        uiConfigs: JSON.stringify(this.toJSON())
      }
    };
  }

  addConditionItem () {
    const { conditions } = this.extension;
    conditions.push({
      field: '',
      name: '',
      operator: '',
      value: ''
    });
  }

  removeConditionItem (index) {
    const { conditions } = this.extension;
    conditions.splice(index, 1);
  }

  updateData (data = {}) {
    mergeWith(this, data, (objValue, srcValue) => {
      if (Array.isArray(objValue)) {
        return srcValue;
      }
    });
  }

  toJSON () {
    const { id, name, nodeType, extension } = this;
    return cloneDeep({ id, name, nodeType, extension });
  }
}
