import { isFunction } from 'lodash';

export default {
  name: 'flowchartPluginBase',

  props: {
    graph: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      initialized: false
    };
  },

  watch: {
    graph: {
      immediate: true,
      handler () {
        if (!this.initialized && this.graph) {
          this._initPlugin();
        }
      }
    }
  },

  methods: {
    async _initPlugin () {

      if (!isFunction(this.install)) {
        throw new Error('Flowchart Plugins Need Implement【install】Method');
      }

      const { graph } = this;
      await this.install(graph);
      this.initialized = true;
    }
  }
};
