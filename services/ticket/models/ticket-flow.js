import { get, mergeWith } from 'lodash';
import TicketNode from './ticket-node';
import TicketEdge from './ticket-edge';

export default class TicketFlow {
  // templateKey
  key = '';

  // 源数据
  flowData = {};

  // 流程节点
  nodes = [];
  
  // 流程节点关系
  edges = [];

  constructor (key, data = {}) {
    this.key = key;
    this.flowData = data;
    // TODO 接口层做数据适配
    const { nodes = [], relations = [] } = data;

    this.nodes = nodes.map(node => {
      const uiConfigs = get(node, 'metadata.uiConfigs', '[]');
      return new TicketNode({
        ...JSON.parse(uiConfigs),
        id: `node${node.id}`
      });
    });

    this.edges = relations.map(relation => {
      const uiConfigs = get(relation, 'metadata.uiConfigs', '[]');
      return new TicketEdge({
        ...JSON.parse(uiConfigs),
        source: `node${relation.start}`,
        target: `node${relation.end}`,
      });
    });
    
  }

  updateData (data = {}) {
    mergeWith(this, data, (objValue, srcValue) => {
      if (Array.isArray(objValue)) {
        return srcValue;
      }
    });
  }

  toJSON () {
    const { nodes = [], edges = [] } = this;

    return {
      nodes: nodes.map(node => node.toJSON()),
      edges: edges.map(edge => edge.toJSON())
    };
  }

  // 保存数据
  toBizData () {
    const nodes = this.nodes.map(node => {
      const edges = this.edges.filter(edge => edge.target === node.id);
      const { relation, conditions } = node.extension;
      edges.forEach(edge => {
        edge.updateData({
          extension: {
            relation, conditions
          }
        });
      });

      return node.toBizData();
    });

    const edges = this.edges.map(edge => edge.toBizData());

    return { nodes, relations: edges };
  }
}
