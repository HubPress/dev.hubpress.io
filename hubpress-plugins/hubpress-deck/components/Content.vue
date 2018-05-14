<template>
<div class="decks-container">
    <div class="ui fixed inverted menu">
        <div class="right menu">
            <div class="ui right aligned category search item">
                <div class="ui transparent icon input inverted">
                    <input type="text" placeholder="Filter by title or tag..." v-model="filterValue">
                    <i class="filter link icon"></i>
                </div>
                <div class="results"></div>
            </div>
            <a href="#" class="item" v-on:click.stop.prevent="synchronize()">
                <div class="ui icon" data-tooltip="Synchronize content" data-position="bottom right">
                    <i class="refresh large icon"></i>
                </div>
            </a>
            <a href="#" class="item" v-on:click.stop.prevent="newDeck()">
                <div class="ui icon" data-tooltip="Create a deck" data-position="bottom right">
                    <i class="add large icon"></i>
                </div>
            </a>
        </div>
    </div>

    <div class="ui basic modal">
        <div class="ui icon header">
            <i class="trash icon"></i> Delete the deck "{{ deckToDelete.title }}"
        </div>
        <div class="content">
            <p>Are you sure you want to delete this deck?</p>
        </div>
        <div class="actions">
            <div class="ui red basic cancel inverted button">
                <i class="remove icon"></i> No
            </div>
            <div class="ui green ok inverted button">
                <i class="checkmark icon"></i> Yes
            </div>
        </div>
    </div>

    <div class="decks ui container centered">

        <h2 class="ui center aligned icon header">
        <i class="circular unordered list icon"></i>
        {{ decks.length }} deck(s)
        <span v-if="filterValue.trim().length" class="">
          filtered by <span class="ui tiny header orange">{{ filterValue }}</span>
        </span>
      </h2>

        <div class="ui divider"></div>

        <div class="ui cards centered aligned">
            <div class="ui card" v-bind:class="getDeckStatusColor(deck)" v-for="deck in decks" :key="deck.id">
                <div class="content">
                    <div class="header">{{deck.title}}</div>
                    <div class="meta">
                        <span class="right floated time">{{ publishedAt(deck) }}</span>
                        <span class="status">{{type(deck)}} - {{ status(deck) }}</span>
                    </div>
                </div>
                <div class="image cover">
                    <div :style="'background-image: url(\''+ deckCoverUrl(deck) +'\')'">
                    </div>
                </div>
                <div class="extra content">
                    <i class="right floated large edit link icon" v-on:click="navigateToDeck(deck)"></i>
                    <i class="right floated large trash link icon" v-on:click="displayConfirmMessage(deck)"></i>
                    <div class="author">
                        <img class="ui avatar image" :src="getDeckAuthor(deck).avatar_url"> {{getDeckAuthor(deck).name || getDeckAuthor(deck).login}}
                    </div>
                </div>
                <div class="extra content">
                    <a class="ui tiny label" v-for="tag in deck.tags" :key="tag">
                        <i class="tag icon"></i> {{ tag }}
                    </a>
                    <div class="" v-if="!deck.tags || !deck.tags.length">
                        No tag
                    </div>

                </div>
            </div>

        </div>
    </div>
</div>
</template>

<script>
import moment from 'moment'
import uuid from 'node-uuid'
import { DECKS_GET, DECKS_SYNCHRONIZE, DECK_DELETE } from '../constants'

export default {
  name: 'decks',
  data: function() {
    return {
      deckToDelete: {},
      filterValue: '',
    }
  },
  beforeCreate: () => {},
  beforeMount: function() {
    this.$store.dispatch(DECKS_GET)
  },
  beforeDestroy: function() {
    $('.ui.basic.modal').remove()
  },
  mounted: function() {
    $('.ui.basic.modal').modal({
      closable: false,
      onDeny: () => {},
      onApprove: () => {
        this.$store.dispatch(DECK_DELETE, this.deckToDelete._id)
      },
    })
  },
  methods: {
    status: function(deck) {
      return (!!deck.published && `Published`) || 'Draft'
    },
    type: function(deck) {
      return deck.type.replace(/\b\w/g, l => l.toUpperCase())
    },
    publishedAt: function(deck) {
      return (!!deck.published && deck.published_at && moment(deck.published_at).fromNow()) || ''
    },
    deckCoverUrl: function(deck) {
      let image = deck.image || 'https://hubpress.github.io/img/logo.png'
      image = image.startsWith('http')
        ? image
        : `${this.$store.state.application.config.urls.site}/${image}`
      return image
    },
    getDeckStatusColor: function(deck) {
      if (!deck.original) {
        return 'red'
      } else if (deck.original.content !== deck.content) {
        // if deck has changed
        return 'orange'
      } else {
        return 'green'
      }
    },
    displayConfirmMessage: function(deck) {
      this.deckToDelete = deck
      $('.ui.basic.modal').modal('show')
    },
    navigateToDeck: function(deck) {
      console.log(deck)
      // named route
      this.$router.push({ name: 'deck', params: { id: deck._id } })
    },
    newDeck: function() {
      // Create a new deck
      this.$router.push({ name: 'deck', params: { id: uuid.v4() } })
    },
    getDeckTags: function(deck) {
      return deck.tags || []
    },
    getDeckAuthor: function(deck) {
      return deck.author || this.$store.state.authentication.userInformations
    },
    synchronize: function() {
      this.$store.dispatch(DECKS_SYNCHRONIZE)
    },
  },
  computed: {
    decks: function() {
      const filter = this.filterValue.trim()
      if (filter === '') return this.$store.state.deck.decks

      return this.$store.state.deck.decks.filter(deck => {
        return (
          deck.title.toLowerCase().indexOf(filter.toLowerCase()) >= 0 ||
          (deck.tags &&
            deck.tags.filter(
              tag => tag.toLowerCase().indexOf(filter.toLowerCase()) >= 0,
            ).length)
        )
      })
    },
  },
}
</script>

<style>
.decks-container .menu {
  min-height: 47px;
}

.decks-container {
  height: 100%;
  overflow: auto;
}

.decks.ui.container {
  padding-top: 60px;
}

.image.cover > div {
  width: 100%;
  height: 200px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
}

@media screen and (max-width: 622px) {
  .decks.ui.container .ui.card .image.cover {
    display:none;
  }
}
</style>
