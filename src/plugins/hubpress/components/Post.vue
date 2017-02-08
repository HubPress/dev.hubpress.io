<template>
  <div class="post-container">
    <div class="ui fixed inverted menu">
        <div class="right menu">
          <a href="#" class="item">
            <div class="ui icon" data-tooltip="Need some help?" data-position="bottom right">
              <i class="help large icon"></i>
            </div>
          </a>
          <a href="#" class="item">
            <div class="ui icon" data-tooltip="Light mode" data-position="bottom right">
              <i class="sun large icon"></i>
            </div>
          </a>
          <a href="#" class="item">
            <div class="ui icon" data-tooltip="Show preview" data-position="bottom right">
              <i class="unhide large icon"></i>
            </div>
          </a>
          <a href="#" class="item">
            <div class="ui icon" data-tooltip="Save your post" data-position="bottom right">
              <i class="save large icon"></i>
            </div>
          </a>
          <a href="#" class="item">
            <div class="ui icon" data-tooltip="Publish your post" data-position="bottom right">
              <i class="rocket large icon"></i>
            </div>
          </a>
        </div>
    </div>

    <div class="post-editor">
      <codemirror class="container" :code="post.content" :options="editorOption" @changed="codeChange"></codemirror>
    </div>
  </div>
</template>

<script>

import asciidocMode from './codemirror/mode/asciidoc'
import markdownMode from 'codemirror/mode/markdown/markdown'
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
/*.CodeMirror-scroll {padding: 30px 100px 30px 100px; box-sizing: border-box;}*/

.CodeMirror-sizer {
    padding-top: 2em;
    font-size: 1.14285714rem;
    max-width: 750px !important;
    line-height: 1.5;
    display: block;
}

@media only screen and (max-width: 767px) {
  .CodeMirror-sizer {
      width: auto !important;
      margin-left: 1em !important;
      margin-right: 1em !important;
  }
}

@media only screen and (min-width: 768px) {
  .CodeMirror-sizer {
    margin-left: auto !important;
    margin-right: auto !important;
  }
}

.CodeMirror-gutter-wrapper { display: none !important; }

.cm-header { font-size: 1.8em; font-weight: bold;}
.cm-header-2 { font-size: 1.6em; font-weight: bold;}
.cm-header-3 { font-size: 1.45em; font-weight: bold;}
.cm-header-4 { font-size: 1.3em; font-weight: bold;}
.cm-header-5 { font-size: 1.15em; font-weight: bold;}
.cm-header-6 { font-size: 1.05em; font-weight: bold;}

.post-editor {
  padding-top: 40px;
}
.post-editor, .CodeMirror, .post-container {
  height: 100%;
  min-height: 100%;
}
</style>
