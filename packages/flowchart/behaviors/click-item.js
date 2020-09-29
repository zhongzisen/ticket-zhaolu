import G6 from '@antv/g6/lib';
import events from '../events';
import { ITEM_TYPE, ITEM_STATE } from '../constants';

G6.registerBehavior('click-item', {
  getDefaultCfg() {
    return {
      itemTypes: Object.values(ITEM_TYPE),
      shouldBegin(item) {
        return item && this.itemTypes.includes(item.get('type'));
      }
    };
  },
  getEvents() {
    // 监听事件
    events.on('item-state-clear', this.clearSelected.bind(this));

    return {
      'canvas:click': 'clearSelected', 
      'node:click': 'onClick',
      'node:mouseover': 'onMouseover',
      'node:mouseout': 'onMouseout',
      'edge:click': 'onClick',
      'edge:mouseover': 'onMouseover',
      'edge:mouseout': 'onMouseout',
    };
  },
  onClick (ev) {
    const item = ev.item;
    if (this.shouldBegin(item)) {
      this.selectedItem(item);
    }
  },
  onMouseover (ev) {
    const item = ev.item;
    if (this.shouldBegin(item)) {
      this.graph.setItemState(item, ITEM_STATE.ACTIVATED, true);
    }    
  },
  onMouseout (ev) {
    const item = ev.item;
    if (this.shouldBegin(item)) {
      this.graph.setItemState(item, ITEM_STATE.ACTIVATED, false);
    } 
  },
  selectedItem (item) {
    if (this.shouldBegin(item)) {
      this.clearSelected();
      this.graph.setItemState(item, ITEM_STATE.SELECTED, !item.hasState(ITEM_STATE.SELECTED)); // 切换选中
    }
  },
  clearSelected() {
    const selectedItems = [];
    this.itemTypes.forEach(type => {
      const items = this.graph.findAllByState(type, ITEM_STATE.SELECTED);
      selectedItems.push(...items);
    });
    selectedItems.forEach(item => this.graph.setItemState(item, ITEM_STATE.SELECTED, false));
  }

});
