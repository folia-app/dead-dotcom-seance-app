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
  h2.font-bold(style="margin-top:32px; font-size: 1.75em") {{ company.name }}
  p
    | {{ company.years }}
    template(v-if="guileOwner") , 2021-

  p.px-12.mt-24 {{ company.description }}

  template(v-if="guileOwner")
    .mt-24
      | CEO<br>{{ $store.getters.addrShort(guileOwner) }}

  //- logo progression
  .my-56.flex.flex-wrap.w-full
    .w-full.sm_w-1x3.mb-20
      h5.font-bold.mb-12.text-14 {{ company.years.split('–')[0] }} Logo
      a(:href="`/art/${company.name}/_original.png`", target="_blank")
        img.block.mx-auto(style="height:200px", :src="`/art/${company.name}/_original.png`")
    .w-full.sm_w-1x3.mb-20
      h5.font-bold.mb-12.text-14 Cosmic Inspiration
      a(:href="`/art/${company.name}/inspo.png`", target="_blank")
        img.block.mx-auto(style="height:200px", :src="`/art/${company.name}/inspo.png`")
    .w-full.sm_w-1x3.mb-20
      h5.font-bold.mb-12.text-14 Twardowski Revival
      a(:href="guileImgURL", target="_blank")
        img.block.mx-auto(style="height:200px", :src="guileImgURL")

  nft-guile.mt-64(:company="company")

  machine-nfts.my-36

</template>

<style>
article.company{
  text-align: center;
}
</style>
