<template>
<div class="post-container">
  <div class="ui fixed inverted menu">
    <div class="right menu">
      <a href="#" class="item" v-on:click.stop.prevent="showAsciidocHelp()">
        <div class="ui icon" data-tooltip="Need some help?" data-position="bottom right">
          <i class="help large icon"></i>
        </div>
      </a>
      <a href="#" class="item" v-on:click.stop.prevent="switchLight()">
        <div class="ui icon" v-bind:data-tooltip="lightLabel" data-position="bottom right">
          <i class="large icon" v-bind:class="{ 'sun': isDark, 'moon': !isDark }"></i>
        </div>
      </a>
      <a href="#" class="item">
        <div class="ui icon" v-bind:data-tooltip="previewLabel" data-position="bottom right" v-on:click.stop.prevent="switchPreview()">
          <i class="large icon" v-bind:class="{'unhide':!isPreviewVisible, 'hide':isPreviewVisible}"></i>
        </div>
      </a>
      <a href="#" class="item" v-if="isRemoteActionVisible" v-on:click.stop.prevent="remoteSave()">
        <div class="ui icon" data-tooltip="Save your post remotely" data-position="bottom right">
          <i class="save large icon"></i>
        </div>
      </a>
      <a href="#" class="item" v-if="isRemoteActionVisible" v-on:click.stop.prevent="publish()">
        <div class="ui icon" v-bind:data-tooltip="publishLabel" data-position="bottom right">
          <i class="icons">
                <i class="rocket large icon"></i>
          <i class="big red dont icon" v-if="post.published"></i>
          </i>
        </div>
      </a>
    </div>
  </div>

  <div id="asciidoc-help" class="ui modal">
    <i class="close icon"></i>
    <div class="header">
      Asciidoc syntax help
    </div>
    <div class="content">
      <table class="ui table">
        <thead>
          <tr>
            <th class="heigth wide">Result</th>
            <th class="heigth wide">Syntax</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Bold</strong></td>
            <td>*content*</td>
          </tr>
          <tr>
            <td><i>Emphasize</i></td>
            <td>_content_</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="post-editor">
    <div class="ui grid" v-bind:class="{ 'dark': isDark, 'light': !isDark }">
      <div class="row">

      <div id="asciidoc-content" class="column" v-bind:class="{'sixteen wide mobile height wide computer is-preview-visible': isPreviewVisible, 'sixteen wide': !isPreviewVisible}">
        <codemirror ref="codeEditor" class="container" :code="content" :options="editorOption" @changed="contentChange"></codemirror>

      </div>
      <div id="asciidoc-preview" class="column" v-bind:class="{'sixteen wide mobile height wide computer is-preview-visible': isPreviewVisible}" v-if="isPreviewVisible">
        <preview :post="post"></preview>
      </div>
    </div>
    </div>
  </div>
</div>
</template>

<script>
import asciidocMode from './codemirror/mode/asciidoc'
import markdownMode from 'codemirror/mode/markdown/markdown'
import overlay from './codemirror/mode/overlay'
import Preview from './Preview'


const themes = [
  // 'zenburn',
  'base16-light'
  // '3024-day',
  // 'duotone-dark',
  // 'mdn-like',
  // 'seti',
  // '3024-night',
  // 'duotone-light',
  // 'midnight',
  // 'solarized',
  // 'abcdef',
  // 'eclipse',
  // 'monokai',
  // 'the-matrix',
  // 'ambiance-mobile',
  // 'elegant',
  // 'neat',
  // 'tomorrow-night-bright',
  // 'ambiance',
  // 'erlang-dark',
  // 'neo',
  // 'tomorrow-night-eighties',
  // 'base16-dark',
  // 'hopscotch',
  // 'night',
  // 'ttcn',
  // 'icecoder',
  // 'panda-syntax',
  // 'twilight',
  // 'bespin',
  // 'isotope',
  // 'paraiso-dark',
  // 'vibrant-ink',
  // 'blackboard',
  // 'lesser-dark',
  // 'paraiso-light',
  // 'xq-dark',
  // 'cobalt',
  // 'liquibyte',
  // 'pastel-on-dark',
  // 'xq-light',
  // 'colorforth',
  // 'material',
  // 'railscasts',
  // 'yeti',
  // 'dracula',
  // 'mbo',
  // 'rubyblue'
]

themes.forEach(theme => {
  require(`codemirror/theme/${theme}.css`)
})

import {
  POST_GET,
  POST_CHANGE_CONTENT,
  POST_REMOTE_SAVE,
  POST_PUBLISH,
  POST_UNPUBLISH
} from '../constants'

export default {
  name: 'posts',
  data() {
    return {
      content: undefined,
      timeout: undefined,
      isDark: true,
      isPreviewVisible: false,
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
        extraKeys: {
          "Ctrl": "autocomplete"
        },
        // 代码折叠
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers"],
        // 选中文本自动高亮，及高亮方式
        styleSelectedText: true,
        highlightSelectionMatches: {
          showToken: /\w/,
          annotateScrollbar: true
        },
        // more codemirror config...
        // 如果有hint方面的配置，也应该出现在这里
      }
    }
  },
  methods: {
    contentChange: function(updatedContent) {
      if (this.post.content === updatedContent)
        return

      const delay = this.$store.state.application.config.meta.delay ? this.$store.state.application.config.meta.delay : 200

      if (this.timeout) {
        window.clearTimeout(this.timeout);
      }

      this.timeout = window.setTimeout(() => {
        this.$store.dispatch(POST_CHANGE_CONTENT, {
          _id: this.post._id,
          content: updatedContent
        })
      }, delay ? delay : 200);
    },
    showAsciidocHelp: function() {
      $('#asciidoc-help')
        .modal('show');
    },
    switchLight: function() {
      this.isDark = !this.isDark
      this.$refs.codeEditor.editor.setOption('theme', this.isDark ? 'zenburn':'base16-light')
    },
    switchPreview: function() {
      this.isPreviewVisible = !this.isPreviewVisible
    },
    remoteSave: function() {
      console.log('Remote save')
      if (this.post.published) {
        this.$store.dispatch(POST_PUBLISH, this.post._id)
      } else {
        this.$store.dispatch(POST_REMOTE_SAVE, this.post._id)
      }
    },
    publish: function() {
      console.log('Remote save')
      if (this.post.published) {
        this.$store.dispatch(POST_UNPUBLISH, this.post._id)
      } else {
        this.$store.dispatch(POST_PUBLISH, this.post._id)
      }
    },
    unpublish: function() {
      this.$store.dispatch(POST_UNPUBLISH, this.post._id)
    }
  },
  beforeMount: function() {
    this.$store.dispatch(POST_GET, this.$route.params.id)
  },
  mounted: function() {
    console.log('Mounted Post', this)

    $('.ui.dropdown.item.themes')
      .dropdown()

    $('#asciidoc-help')
      .modal({
        closable: true
      })
  },
  beforeUpdate: function() {
    if (!this.content) {
      this.content = this.post.content
    }
  },
  computed: {
    id: function() {
      return this.$route.params.id
    },
    post: function() {
      return this.$store.state.hubpress.post
    },
    previewLabel: function() {
      return this.isPreviewVisible? 'Hide preview' : 'Show preview'
    },
    lightLabel: function() {
      return this.isDark ? 'Light mode' : 'Dark mode'
    },
    publishLabel: function() {
      return this.$store.state.hubpress.post.published ? 'Unpublish post' : 'Publish post'
    },
    isRemoteActionVisible: function() {
      return !!this.$store.state.hubpress.post.title
    }
  },
  beforeCreate: () => {},
  created: function() {},
  components: {
    Preview
  }
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

.CodeMirror-gutter-wrapper {
  display: none !important;
}

.cm-header {
  font-size: 1.8em;
  font-weight: bold;
}

.cm-header-2 {
  font-size: 1.6em;
  font-weight: bold;
}

.cm-header-3 {
  font-size: 1.45em;
  font-weight: bold;
}

.cm-header-4 {
  font-size: 1.3em;
  font-weight: bold;
}

.cm-header-5 {
  font-size: 1.15em;
  font-weight: bold;
}

.cm-header-6 {
  font-size: 1.05em;
  font-weight: bold;
}

.post-editor {
  padding-top: 47px;
}

.post-editor,
.post-editor .ui.grid,
.post-editor .ui.grid .column,
.CodeMirror,
.post-container {
  height: 100%;
  min-height: 100%;
}

.post-editor .ui.grid > .row {
  padding-top: 0;
  padding-bottom: 0;
}
.post-editor .ui.grid.light > .row {
  background-color: #f5f5f5;
  color: #202020;
}
.post-editor .ui.grid.light > .row .ui.header {
  color: #202020;
}
.post-editor .ui.grid.light > .row a {
  color: #aa759f;
}
.post-editor .ui.grid.dark > .row, .post-editor .ui.grid.dark > .row .ui.header {
  background-color: #3f3f3f;
  color: #dcdccc;
}
.post-editor .ui.grid.dark > .row .ui.header {
  color: #dcdccc;
}
.post-editor .ui.grid.dark > .row a {
  color: #dcdcaa;
}

.post-editor .ui.grid {
  padding-top: 0;
  padding-bottom: 0;
  margin: 0;
}

.post-editor .ui.grid .column {
  padding-top: 0;
  margin-top: 0;
  padding-bottom: 0;
  margin-bottom: 0;
}

#asciidoc-preview {
  overflow-y: auto;
  padding-top: 2em;
  font-size: 1.2em;
  font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
  word-wrap: break-word;
}

#asciidoc-preview > div {
  max-width: 750px !important;
  margin: auto auto;
}

#asciidoc-preview > div .ui.header {
  font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
}

#asciidoc-preview .content pre {
  background-color: #dcdccc;
  color: #2e2e2e;
  padding: 10px;
  border-radius: 5px;
  overflow: auto;
}

@media screen and (max-width: 992px) {
  #asciidoc-content {
    display:block;
  }
  #asciidoc-content.is-preview-visible {
    display:none;
  }
  #asciidoc-preview {
    display:none;
  }
  #asciidoc-preview.is-preview-visible {
    display:block;
  }
}

</style>
