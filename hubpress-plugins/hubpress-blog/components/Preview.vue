<template lang="html">
  <div>
    <div class="html-rendering" v-if="!iframe">
      <h1 class="ui header">{{post.title}}</h1>
      <div id="html-content" class="content" v-html="post.html"></div>
    </div>

    <div class="iframe-rendering" v-if="iframe">
      <iframe class="published-preview" :srcdoc="post.publishedContent" frameborder="0"></iframe>
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
  props: ['post', 'iframe'],
  mounted: function() {
    if (this.iframe) {
      return
    }
    applyScript(this.post.content && this.post.content.trim().length)
  },
  updated: function(val1, val2) {
    if (this.iframe) {
      return
    }
    applyScript(true)
  },
}
</script>

<style lang="css">
  .html-rendering, .published-preview {
    min-width: 100%;
  height: calc(100vh - 47px);
  min-height: calc(100vh - 47px);
  }
</style>
