<template>
  <div>
    <input type="text" name="test" id="test" value="">
  </div>
</template>

<script>
  export default {
    name: 'test',
    beforeCreate: () => {
      console.log('dashboard beforeCreate')
    },
    created: function () {
      console.log('dashboard created')
    }
  }

</script>

<style>
</style>
