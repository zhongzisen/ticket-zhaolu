import Vue from 'vue';
import VueRouter from 'vue-router';
import QDesign from '@atsfe/qaxd';
import qpHelperVue from '@atsfe/qp-helper-vue';

import globalPlugins from '@/shared/plugins';
import globalConditionHandlers from '@/shared/configs/condition-handlers';









const bootstrap = ({
  routes,
  conditionHandlers = [],
  parcels,
  services,
  plugins
}) => {
  const allConditionHandlers = globalConditionHandlers.concat(conditionHandlers);

  Vue.config.productionTip = false;
  Vue.use(VueRouter);
  Vue.use(QDesign);

  /*eslint no-unused-vars: ["error", { "args": "none" }]*/
  Vue.config.errorHandler = (err, vm, info) => {
    qp.errorHandling.catchError(() => {
      throw err;
    });
  };

  const vueLifecycles = qpHelperVue({
    Vue,
    appOptions(props) {
      const router = new VueRouter({
        base: window.__POWERED_BY_QP__ ? `/${props.pathname}` : '/',
        mode: 'history',
        routes,
      });
      /* 返回根组件实例化 options */
      return {
        ...globalPlugins,
        ...plugins,
        router,
        render: h => h('router-view')
      };
    },
    parcels,
    services
  });

  return {
    bootstrap: vueLifecycles.bootstrap,
    mount: function (props) {
      qp.errorHandling.registerConditionHandlers(allConditionHandlers);
      vueLifecycles.mount(props);
    },
    unmount: function () {
      qp.errorHandling.unregisterConditionHandlers(allConditionHandlers);
      vueLifecycles.unmount();
    },
    update: vueLifecycles.update
  };
};

export default bootstrap;
