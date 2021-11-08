<script setup>
</script>

<template lang="pug">
#app
  header.site-header
    h1 dead dotcom seance
  table
    tbody
      tr
        td(width="20%")
          router-link(to="/third-voice") Third Voice
        td
          router-view
        td(width="20%")

</template>

<style>
html{
  -webkit-font-smoothing: none;
  background: #010101;
  color: white;
}
</style>

<style scoped>
  #app{
    width: 100%;
    max-width: 1024px;
    margin: 0 auto;
  }
  table{
    width:100%;
    /* border-collapse:  collapse; */
  }
  td, .site-header{
    border:  5px #888 groove;
    border-radius: 10px;
  }
</style>
