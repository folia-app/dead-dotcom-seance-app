<script setup>
import { ref, computed, inject, onBeforeMount } from 'vue'
import store from '@/store'
import Btn from '@/components/Btn'
import NftMachine from '@/components/NFTMachine'

const work = ref({})
const company = inject('company')

const isSoldOut = computed(() => work.value.printed && Number(work.value.printed) >= Number(work.value.editions))

const ganImgURL = (n) => `/art/${company.name}/output${n}.png`

const getWork = async () => {
  work.value = await store.dispatch('getWork', { id: company.id, flush: true })
  // console.log(work.value)
}

const mintMachine = async () => {
  try {
    const tx = await store.dispatch('mintMachine', company.id)
    console.log('tx', tx)
    getWork(true)
  } catch (e) {
    console.error(e)
  }
}
</script>

<template lang="pug">
section.machine-nfts(v-intersect, @intersect="!work.printed && getWork(false)")
  h3 Machine Expressions
  .grooved-cell
    template(v-if="work")
      | Minted {{ work.printed || '...' }}/{{ work.editions || '...' }}
      | <br>0.1 ETH
    template(v-else) ...

  div(v-if="!isSoldOut", style="display:inline-block; width:33%; margin-bottom:24px; padding: 0 5px; box-sizing:border-box")
    div
      button(@click="mintMachine")
        btn(style="padding: 8px 16px;") Mint

  div(v-for="n in Number(work.printed)", style="display:inline-block; width:33%; margin-bottom:24px; padding: 0 5px; box-sizing:border-box")
    div(style="padding:5px")
      | {{ n }}
      nft-machine(:no="n")
        a(:href="ganImgURL(n)", target="_blank")
          img(:src="ganImgURL(n)", style="max-width:100%")
</template>
