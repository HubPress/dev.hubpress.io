<template>
  <div class="full height">

    <div class="ui stackable grid container">
      <div class="four wide column" v-for="post in posts">
        <div class="ui centered card red">
          <div class="content">
            <div class="right floated meta">14h</div>
            <img class="ui avatar image" :src="post.author.avatar_url"> {{post.author.name || post.author.login}}
          </div>
          <div class="image">
            <img :src="post.image">
          </div>
          <div class="content">
            <router-link active-class="active" class="header" :to="'posts/'+post._id">
              {{post.title}}
            </router-link>
            <span class="right floated">
              <i class="heart outline like icon"></i>
              17 likes
            </span>
            <i class="comment icon"></i> 3 comments
          </div>
          <div class="extra content">
            <div class="ui large transparent left icon input">
              <i class="heart outline icon"></i>
              <input type="text" placeholder="Add Comment...">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'posts',
  beforeCreate: () => {},
  created: function() {},
  computed: {
    posts: function() {
      return this.$store.state.hubpress.posts
    }
  }
}
</script>

<style>

</style>
