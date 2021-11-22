<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import list from '../../content/companies.js'
import Btn from '@/components/Btn'

const route = useRoute()

const company = list.find(com => com.name === route.params.company)

const artPath = computed(() => '/art/' + route.params.company)
const guileImgURL = computed(() => artPath.value + '/guile.jpg')
const ganImgURL = (n) => `${artPath.value}/output${n}.png`
</script>

<template lang="pug">
article.company
  h2(style="margin-top:32px; font-size: 1.75em") {{ company.name }}
  p {{ company.years }}
  p(style="padding:0 12px") {{ company.description }}

  table
    tr
      td(colspan="3")
        div(style="margin:24px 0 24px;")
          //- h5 Twardowski Revival
          div
            a(:href="guileImgURL", target="_blank")
              img(:src="guileImgURL", style="max-width:75%")
          div(style="margin-top:12px")
            btn(style="padding: 10px 44px; font-size: 1.05em;")
              | Mint
    tr
      td(width="33%" style="vertical-align:top;")
        h5 2001 Original
        img(style="height:200px", :src="`/art/${company.name}/_original.png`")
      td(width="33%" style="vertical-align:top")
        h5 2021 Machine
        img(style="height:200px", :src="`/art/${company.name}/${company.guileRefImg}`")
      td(width="33%" style="vertical-align:top")
        h5 2021 Guile Twardowski
        img(style="height:200px", :src="guileImgURL")

  div(style="margin-top:60px")
    h3 Machine Expressions
    div(v-for="n in 200", style="display:inline-block; width:33%; margin-bottom:24px; padding: 0 5px; box-sizing:border-box")
      div(style="padding:5px")
        a(:href="ganImgURL(n)", target="_blank")
          img(:src="ganImgURL(n)", @error="e => { e.target.parentElement.parentElement.parentElement.style.display = 'none' }", style="max-width:100%")
      div
        btn(style="padding: 8px 16px;") Mint

</template>

<style>
article.company{
  text-align: center;
}
</style>
