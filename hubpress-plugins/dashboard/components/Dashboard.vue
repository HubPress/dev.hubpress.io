<template>
  <div>
    Dashboard
  </div>
</template>

<script>
export default {
  name: 'dashboard',
  beforeCreate: () => {
    console.log('dashboard beforeCreate')
  },
  created: function() {
    console.log('dashboard created')
  },
}
</script>

<style>
</style>
