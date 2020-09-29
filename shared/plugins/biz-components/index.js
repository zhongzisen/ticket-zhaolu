import Vue from 'vue';
import BizPermission from '@bizcom/permission';
import { BizTable, BizColumn } from '@bizcom/table';
import '@bizcom/table/lib/index.scss';

Vue.use(BizPermission);
Vue.component('biz-table', BizTable);
Vue.component('biz-column', BizColumn);
