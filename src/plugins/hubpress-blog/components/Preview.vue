<template lang="html">
  <div class="">
    <h1 class="ui header">{{post.title}}</h1>
    <div id="html-rendering" v-html="post.html">
    </div>
  </div>
</template>

<script>
function applyScript(hasChanged) {
  if (!hasChanged) return

  let element = document.getElementById('html-rendering')
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

  if (window.instgrm) window.instgrm.Embeds.process()
}

export default {
  name: 'preview',
  props: ['post'],
  mounted: function() {
    applyScript(this.post.content && this.post.content.trim().length)
  },
  updated: function(val1, val2) {
    applyScript(true)
  },
}
</script>

<style lang="css">
</style>
