
import G6 from '@antv/g6/lib';
import { ITEM_TYPE, ITEM_STATE } from '../constants';

G6.registerBehavior('keyboard', {
  getDefaultCfg() {
    return {
      itemTypes: Object.values(ITEM_TYPE),
      backKeyCode: 8,
      deleteKeyCode: 46
    };
  },
  getEvents() {
    return {
      keydown: 'onKeyDown'
    };
  },
  
  onKeyDown(e) {
    const code = e.keyCode || e.which;
    switch (code) {
      case this.deleteKeyCode:
      case this.backKeyCode:
        this.removeItems();
        break;
    }
  },
  removeItems() {
    // 删除已选中的item
    const { graph, itemTypes } = this;
    const selectedItems = [];
    itemTypes.forEach(type => {
      selectedItems.push(...graph.findAllByState(type, ITEM_STATE.SELECTED));
    });

    selectedItems.forEach(item => graph.removeItem(item));
    graph.paint();
  }
});
