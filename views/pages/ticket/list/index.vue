<template>
  <div class="ticket-list">
    <q-tabs
      :value="listTypeKey"
      type="card"
      @tab-click="handleClick"
    >
      <q-tab-pane
        v-for="item in ticketListTypes"
        :key="item.key"
        :label="item.label"
        :name="item.key"
      >
        <list-table v-if="listTypeKey === item.key" :key="item.key" :params="item.params" />
      </q-tab-pane>
    </q-tabs>
  </div>
</template>

<script>
import { get } from 'lodash';
import { ticketListTypes } from '@/configs/ticket';
import ListTable from '@/views/components/ticket/list-table';

export default {
  name: 'TicketList',
  components: {
    ListTable
  },
  data() {
    return {
      ticketListTypes,
      listTypeKey: get(ticketListTypes, '[0].key')
    };
  },
  created() {
    const listTypeKeys = ticketListTypes.map(item => item.key);
    const { type } = this.$route.params;
    if (type) {
      if (listTypeKeys.includes(type)) {
        this.listTypeKey = type;
        
      } else {
        this.$router.replace({ name: 'notfound' });
      }
    }
  },
  methods: {
    handleClick({ name }) {
      const { listTypeKey } = this;
      if (name !== listTypeKey) {
        this.listTypeKey  = name;

        // 记录当前状态，刷新页面时停留在已选页面上
        this.$router.push({
          name: this.$route.name,
          params: {
            type: name
          }
        });
      }
      
    }
  }
};
</script>
