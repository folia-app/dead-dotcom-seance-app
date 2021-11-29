<script setup>
import { ref, provide } from 'vue'
import { useRoute } from 'vue-router'
import list from '../../content/companies.js'
import store from '@/store'
import Btn from '@/components/Btn'
import NftGuile from '@/components/NFTGuile'
import MachineNfts from '@/components/MachineNFTs'

const route = useRoute()
const guileOwner = ref()

const company = list.find(com => com.name === route.params.company)

const guileImgURL = '/art/' + route.params.company + '/guile.jpg'

store.dispatch('getNFTOwner', company.id).then(o => { guileOwner.value = o })

provide('company', company)
</script>

<template lang="pug">
article.company
  h2(style="margin-top:32px; font-size: 1.75em") {{ company.name }}
  p
    | {{ company.years }}
    template(v-if="guileOwner")
      | &nbsp;, 2021-
      .mt-20
        | CEO<br>{{ $store.getters.addrShort(guileOwner) }}

  p.px-12.text-16.italic "{{ company.description }}"

  nft-guile.my-40(:company="company")

  .flex.w-full
    .w-full.sm_w-1x3
      h5.font-bold.mb-12.text-14 2001 Original
      img.block.mx-auto(style="height:200px", :src="`/art/${company.name}/_original.png`")
    .w-full.sm_w-1x3
      h5.font-bold.mb-12.text-14 Machine Inspiration
      img.block.mx-auto(style="height:200px", :src="`/art/${company.name}/${company.guileRefImg}`")
    .w-full.sm_w-1x3
      h5.font-bold.mb-12.text-14 Guile Twardowski
      img.block.mx-auto(style="height:200px", :src="guileImgURL")

  .my-96.italic (to do machines...)
  //- machine-nfts(style="margin-top:60px")
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
