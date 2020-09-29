<template>
  <node-panel :nodes="nodeItems" />
</template>

<script>
import TicketNode from '@/services/ticket/models/ticket-node';
import { NodePanel } from '@/packages/flowchart';
import { NODE_TYPE } from '@/packages/flowchart/constants';

import { TICKET_NODE_CATEGORY, 
  TICKET_NODE_CATEGORY_NAME, 
  TICKET_NODE_CATEGORY_DESCRIPTION } from '@/constants';

export default {
  components: {
    NodePanel
  },
  data() {
    return {
      nodeItems: []
    };
  },
  created () {
    this.nodeItems = this.getNodeItems();
  },
  methods: {
    getNodeItems () {
      const items = Object.values(TICKET_NODE_CATEGORY).map(category => {

        const ticketNode = new TicketNode({
          name: TICKET_NODE_CATEGORY_NAME[category],
          nodeType: NODE_TYPE.NORMAL,
          extension: {
            category
          }
        });

        switch (category) {
          case TICKET_NODE_CATEGORY.START:
            ticketNode.updateData({
              nodeType: NODE_TYPE.START
            });
            break;

          case TICKET_NODE_CATEGORY.END:
            ticketNode.updateData({
              nodeType: NODE_TYPE.END
            });
            break;
        
          default:
            break;
        }

        return {
          ...ticketNode.toJSON(),
          description: TICKET_NODE_CATEGORY_DESCRIPTION[category],
        };
      });

      return items;
    }
  },
};
</script>
