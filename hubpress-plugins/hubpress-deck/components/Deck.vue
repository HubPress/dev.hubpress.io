<template>
  <div class="deck-container">
    <editor
      :id="id"
      :content="deck.content"
      :published-content="publishedHtml"
      :published="!!deck.published"
      :title="deck.title"
      :templates="templates"
      :hide-simple-preview=true
      @editor-change-content="editorChangeContent"
      @editor-remote-save="editorRemoteSave"
      @editor-publish="editorPublish"
      @preview-change-template="onChangeTemplate"
    />
  </div>
</template>

<script>
import Editor from '~/components/editor/Editor'

import {
  DECK_GET,
  DECK_CHANGE_CONTENT,
  DECK_REMOTE_SAVEE,
  DECK_PUBLISH,
  DECK_UNPUBLISH,
  DECK_REMOTE_SAVE,
} from '../constants'


export default {
  name: 'deck',
  data() {
    return {
      content: undefined,
      timeout: undefined,
      selectedTemplate: 'default',
      publishedHtml: ''
    }
  },
  methods: {
    editorChangeContent: function(payload) {
      this.$store.dispatch(DECK_CHANGE_CONTENT, payload)
        .then(_ => {
          this.publishedHtml = this.applyTemplateChange(this.getSelectedTemplate(this.selectedTemplate), this.deck.publishedContent)
        })
    },
    editorRemoteSave: function(id) {
      console.log('plop')
      if (this.deck.published) {
        this.$store.dispatch(DECK_PUBLISH, {
          _id: id,
          content: this.deck.content
        })
      } else {
        this.$store.dispatch(DECK_REMOTE_SAVE, {
          _id: id,
          content: this.deck.content
        })
      }
    },
    editorPublish: function(id) {
      if (this.deck.published) {
        this.$store.dispatch(DECK_UNPUBLISH, {
          _id: id,
          content: this.deck.content
        })
      } else {
        this.$store.dispatch(DECK_PUBLISH, {
          _id: id,
          content: this.deck.content
        })
      }
    },
    applyTemplateChange: function(selectedTemplate, content) {

      return content.replace('$$revealjs_customtheme$$', selectedTemplate.path)
    },
    onChangeTemplate: function(selectedTemplate) {
      this.selectedTemplate = selectedTemplate
      this.publishedHtml = this.applyTemplateChange(this.getSelectedTemplate(selectedTemplate), this.deck.publishedContent)
    },
    getSelectedTemplate: function(selectedTemplateLabel) {
      if (!this.templates) {
        throw new Error('Templates list is empty')
      }
      let selectedTemplate = this.templates.find(template => template.label === selectedTemplateLabel)
      if (!selectedTemplate) {
        console.log('change selectedTemplate', selectedTemplate)
        selectedTemplate = this.templates.find(template => template.label === 'default')
      }
      return selectedTemplate
    },
  },
  beforeMount: function() {
    console.log('bfrmount',this.$route.params.id)
    this.$store.dispatch(DECK_GET, this.$route.params.id)
  },
  mounted: function() {
    $('.ui.dropdown.item.themes').dropdown()

    $('#asciidoc-help').modal({
      closable: true,
    })
  },
  beforeUpdate: function() {
    if (!this.content || this.content !== this.deck.content) {
      this.content = this.deck.content
    }
  },
  computed: {
    id: function() {
      return this.$route.params.id
    },
    deck: function() {
      return this.$store.state.deck.deck
    },
    templates: function() {
      const document = this.deck
      if (!document.attributes) {
        return
      }

      const templates = (document.attributes['hp-deckonf'] || '')
        .split(',')
        .map(template => template.trim())
        .filter(template => template !== '')
        .map(template => {
          const conferenceAttributes = template.split('/')
          const conference = {
            name: conferenceAttributes[0],
            year: conferenceAttributes[1] || 'latest'
          }
          return {
            label: template,
            path: `https://deckonf.io/templates/conferences/${conference.name}/${conference.year}/revealjs/style.css`
          }
        })

      templates.unshift({
        label: 'default',
        path: `${document.attributes['revealjsdir']}/css/theme/${document.attributes['revealjs_theme'] || 'black'}.css`
      })
      return templates
    },
    previewLabel: function() {
      return this.isPreviewVisible ? 'Hide fast preview' : 'Show fast preview'
    },
    previewLabelIFrame: function() {
      return this.isPreviewVisible ? 'Hide real preview' : 'Show real preview'
    },
    resizeLabel: function() {
      return this.isFullScreen ? 'Compact the preview' : 'Expand the preview'
    },
    lightLabel: function() {
      return this.isDark ? 'Light mode' : 'Dark mode'
    },
    publishLabel: function() {
      return this.$store.state.deck.deck.published
        ? 'Unpublish deck'
        : 'Publish deck'
    },
    isRemoteActionVisible: function() {
      return !!this.$store.state.deck.deck.title
    },
    isPostPublished: function() {
      return !!this.deck.published
    }
  },
  beforeCreate: () => {},
  created: function() {},
  components: {
    Editor
  },
}
</script>

<style>
</style>
