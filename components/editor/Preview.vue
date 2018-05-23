<template lang="html">
  <div>
    <div class="html-rendering" v-if="!displayIframe">
      <h1 class="ui header">{{title}}</h1>
      <div id="html-content" class="content" v-html="html"></div>
    </div>

    <div class="iframe-rendering" v-if="displayIframe">
      <div class="ui form"v-if="!!templates">
        <div class="field template-filter">
          <select class="ui fluid dropdown" v-model="selectedTemplate" @change="onChangeTemplate">
            <option v-for="template in templates" v-bind:value="template.label">
              {{ template.label }}
            </option>
          </select>
        </div>
      </div>
      <iframe class="published-preview" :class="{'no-template': !templates}":srcdoc="publishedContent" frameborder="0"></iframe>
    </div>
  </div>
</template>

<script>
function applyScript(hasChanged) {
  if (!hasChanged) return

  let element = document.getElementById('html-content')
  let scripts = element.getElementsByTagName('script')
  let addedScripts = []
  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i].src != '' && addedScripts.indexOf(scripts[i].src) === -1) {
      let tag = document.createElement('script')
      tag.src = scripts[i].src
      addedScripts.push(tag.src)
      document.getElementsByTagName('head')[0].appendChild(tag)
    } else {
      eval(scripts[i].innerHTML)
    }
  }

  // Add mathjax
  if (!window.MathJax) {
    const tag = document.createElement('script')
    tag.src = `https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML`
    document.getElementsByTagName('head')[0].appendChild(tag)
  }

  // MathJax
  if (window.MathJax) window.MathJax.Hub.Queue(['Typeset', MathJax.Hub])

  // Instagram
  if (window.instgrm) window.instgrm.Embeds.process()
}

export default {
  name: 'preview',
  props: {
    title: String,
    html: String,
    content: String,
    publishedContent: String,
    displayIframe: Boolean,
    templates: Array,
    applyTemplateChange: Function,

    document: Object,
  },
  data: function() {
    return {
      selectedTemplate: 'default'
    }
  },
  mounted: function() {
    if (this.displayIframe) {
      return
    }
    applyScript(this.document.content && this.document.content.trim().length)
  },
  updated: function(val1, val2) {
    if (this.displayIframe) {
      return
    }
    applyScript(true)
  },
  methods: {
    onChangeTemplate: function() {
      this.$emit('preview-change-template', this.selectedTemplate)
    }
  }
}
</script>

<style lang="css">

  .template-filter {
    max-height: 38px;
    height: 38px;
  }
  .published-preview {
    min-width: 100%;
    height: calc(100vh - 87px);
    min-height: calc(100vh - 87px);
  }
  .html-rendering, .published-preview.no-template {
    min-width: 100%;
  height: calc(100vh - 47px);
  min-height: calc(100vh - 47px);
  }



</style>
