<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const artPath = computed(() => '/art/' + route.params.company)
const guileImgURL = computed(() => artPath.value + '/guile.jpg')
const ganImgURL = (n) => `${artPath.value}/output${n}.png`
</script>

<template lang="pug">
article.company
  h2 {{ $route.params.company }}
  a(:href="guileImgURL", target="_blank")
    img(:src="guileImgURL", style="max-width:75%")

  p A logo for a 2001 company named "Third Voice" that lets you put virtual sticky notes on websites and read other users' notes all over the web

  h3 Staff
  a(v-for="n in 200", style="display:inline-block; max-width:25%", :href="ganImgURL(n)", target="_blank")
    img(:src="ganImgURL(n)", @error="e => { e.target.style.display = 'none' }", style="max-width:100%")
</template>

<style>
.company{
  text-align: center;
}
</style>
