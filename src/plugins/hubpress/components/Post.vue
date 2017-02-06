<template>
  <div class="post-editor">
    <codemirror :code="post.content" :options="editorOption" @changed="codeChange"></codemirror>
  </div>
</template>

<script>

import asciidocMode from './codemirror/mode/asciidoc'
import overlay from './codemirror/mode/overlay'

import { POST_GET, POST_CHANGE_CONTENT } from '../constants'

export default {
  name: 'posts',
  data () {
    return {
      editorOption: {
        // 下面所有配置同Codemirror配置，均为可选
        tabSize: 4,
        mode: 'asciidoc',
        theme: 'zenburn',
        lineNumbers: false,
        line: true,
        lineWrapping: true,
        fixedGutter: true,
        // sublime、emacs、vim三种键位模式，支持你的不同操作习惯
        keyMap: "sublime",
        // 按键映射，比如Ctrl键映射autocomplete，autocomplete是hint代码提示事件
        extraKeys: { "Ctrl": "autocomplete" },
        // 代码折叠
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers"],
        // 选中文本自动高亮，及高亮方式
        styleSelectedText: true,
        highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
        // more codemirror config...
        // 如果有hint方面的配置，也应该出现在这里
      }
    }
  },
  methods: {
    codeChange(newCode) {
      console.log('this is new code', newCode)
      this.$store.dispatch(POST_CHANGE_CONTENT, newCode)
    }
  },
  beforeMount: function () {
    this.$store.dispatch(POST_GET, this.$route.params.id)
  },
  mounted: function () {
    console.log('Mounted Post', this)
    //this.code = this.post.content
  },
  computed: {
    id: function () {
      return this.$route.params.id
    },
    post: function () {
      return this.$store.state.hubpress.post
    }
  },
  beforeCreate: () => {},
  created: function() {}
}
</script>

<style>
.CodeMirror-scroll {
  padding: 30px 100px 30px 100px;
  box-sizing: border-box;
}

.CodeMirror-gutter-wrapper {
  display: none;
}

.cm-header-1 { font-size: 2em; }
.cm-header-2 { font-size: 1.75em; }
.cm-header-3 { font-size: 1.5em; }
.cm-header-4 { font-size: 1.3em; }
.cm-header-5 { font-size: 1.2em; }
.cm-header-6 { font-size: 1.15em; }

.post-editor, .CodeMirror {
  height: 100%;
  min-height: 100%;
}
</style>
