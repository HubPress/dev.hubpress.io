<template>
  <div class="deck-container">
    <editor
      :id="id"
      :document="deck"
      :hide-simple-preview=true
      @editor-change-content="editorChangeContent"
      @editor-remote-save="editorRemoteSave"
      @editor-publish="editorPublish"
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
    }
  },
  methods: {
    editorChangeContent: function(payload) {
      this.$store.dispatch(DECK_CHANGE_CONTENT, payload)
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
    }
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
