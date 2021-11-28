<script setup>
import { ref, provide } from 'vue'
import { useRoute } from 'vue-router'
import list from '../../content/companies.js'
import Btn from '@/components/Btn'
import NftGuile from '@/components/NFTGuile'
import MachineNfts from '@/components/MachineNFTs'

const route = useRoute()

const company = list.find(com => com.name === route.params.company)

const guileImgURL = '/art/' + route.params.company + '/guile.jpg'

provide('company', company)
</script>

<template lang="pug">
article.company
  h2(style="margin-top:32px; font-size: 1.75em") {{ company.name }}
  p {{ company.years }}
  p(style="padding:0 12px") {{ company.description }}

  table
    tr
      td(colspan="3")
        nft-guile(:company="company", style="margin:24px 0 24px;")

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

  machine-nfts(style="margin-top:60px")
  //- div(style="margin-top:60px")
    h3 Machine Expressions
    .grooved-cell
      | 0.1 ETH

    div(style="display:inline-block; width:33%; margin-bottom:24px; padding: 0 5px; box-sizing:border-box")
      div
        button
          btn(style="padding: 8px 16px;", @click=) Mint
    //- div(v-for="n in 200", style="display:inline-block; width:33%; margin-bottom:24px; padding: 0 5px; box-sizing:border-box")
      div(style="padding:5px")
        a(:href="ganImgURL(n)", target="_blank")
          img(:src="ganImgURL(n)", @error="e => { e.target.parentElement.parentElement.parentElement.style.display = 'none' }", style="max-width:100%")
      //- div
        btn(style="padding: 8px 16px;") Mint

</template>

<style>
article.company{
  text-align: center;
}
</style>
