import { isPlainObject, merge } from 'lodash';
import Vue from 'vue';
import VueI18n from 'vue-i18n';

import loginI18n from './login';

const mergeLocales = (configs) => {
  return configs.reduce((acc, curr) => {
    ['zh-CN', 'en-US'].forEach(language => {
      const conf = curr[language];
      if (isPlainObject(conf)) {
        merge(acc[language], conf);
      }
    });
    return acc;
  }, {'zh-CN': {}, 'en-US': {}});
};

const configs = [
  loginI18n,
];

const messages = mergeLocales(configs);

function useVueI18n(options) {
  Vue.use(VueI18n);
  return new VueI18n(options);
}

const i18n = useVueI18n({
  locale: qp.globalState.getLocale(),
  fallbackLocale: qp.globalState.getFallbackLocale(),
  messages
});

qp.globalState.onLocaleChange((locale) => {
  i18n.locale = locale;
});

export { default as locale } from './locale';
export { messages, i18n };
