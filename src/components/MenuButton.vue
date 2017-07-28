<template>
  <div id="menu-button" class="ui black launch right attached fixed button"  v-on:click="toggleNavigation">
    <i class="content large icon"></i>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'menuButton',
  methods: {
    toggleNavigation() {
      $('.ui.sidebar').sidebar('toggle')
    },
  },
}
</script>

<style scoped>
/*.launch.button {
  display: block;
}*/

#menu-button.launch.button .icon {
    margin-left: 0px;
}

.fixed.launch.button {
    display: block;
    position: fixed;
    top: 0em;
    left: 0px;
    padding-right: 0.75em;
    /*width: 55px;*/
    height: 47px;
    white-space: nowrap;
    overflow: hidden;
    -webkit-transition: 0.3s width ease, 0.5s transform ease;
    -moz-transition: 0.3s width ease, 0.5s transform ease;
    -o-transition: 0.3s width ease, 0.5s transform ease;
    -ms-transition: 0.3s width ease, 0.5s transform ease;
    transition: 0.3s width ease, 0.5s transform ease;
}
.fixed.launch.button:hover {
  /*width: 130px;*/
}

.fixed.launch.button .text {
    position: absolute;
    white-space: nowrap;
    top: auto;
    left: 54px;
    opacity: 0;
    -webkit-transition: 0.3s opacity 0.3s;
    -moz-transition: 0.3s opacity 0.3s;
    -o-transition: 0.3s opacity 0.3s;
    -ms-transition: 0.3s opacity 0.3s;
    transition: 0.3s opacity 0.3s;
}

.fixed.launch.button:hover .text {
    opacity: 1;
}

</style>
