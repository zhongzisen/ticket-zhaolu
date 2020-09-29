<template>
  <codemirror
    v-model="codeString"
    class="codemirror-wrap"
    :options="cmOptions"
    @input="handleChange"
  />
</template>

<script>
import { isNil } from 'lodash';
import { codemirror } from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';
// theme css
import 'codemirror/theme/monokai.css';

// 这里引入的模式的js，根据设置的mode引入，一定要引入！！
import 'codemirror/mode/javascript/javascript'; 

import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/fold/brace-fold.js';

import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/foldgutter.js';

export default {
  components: {
    codemirror
  },
  props: {
    value: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      codeString: '',

      cmOptions: {
        tabSize: 2,
        theme: 'monokai',
        lineNumbers: true,
        lineWrapping: true, //代码折叠
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        matchBrackets: true,
        showCursorWhenSelecting: true,
        autoCloseBrackets: true
      }
    };
  },
  created () {
    if (!isNil(this.value)) {
      this.codeString = this.value;
    }
  },
  methods: {
    handleChange (value) {
      this.$emit('input', value);
    }
  },
};
</script>

<style lang="scss">
.codemirror-wrap {
  height: 100%;
  flex: 1;
  overflow: auto;
}

.CodeMirror {
  height: 100%;
  font-size: 14px;
}
</style>
