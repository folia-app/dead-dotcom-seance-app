<script setup>
import { ref, computed, inject, onBeforeMount } from 'vue'
import store from '@/store'
import Btn from '@/components/Btn'
import NftMachine from '@/components/NFTMachine'

const props = defineProps({
  registrations: { type: Array, default: () => ([]) }
})
const company = inject('company')

const minted = ref()
const editionSize = ref()

const isSoldOut = computed(() => minted.value && minted.value.length >= editionSize.value)

const getMinted = async () => {
  try {
    let resp = await fetch(`/.netlify/functions/machines/${company.id}`)
    resp = await resp.json()
    minted.value = resp.minted
    editionSize.value = Number(resp.editionSize)
  } catch (e) {
    console.error(e)
    minted.value = null
  }
}

const mintMachine = async () => {
  try {
    const tx = await store.dispatch('mintMachine', company.id)
    console.log('tx', tx)
    getMinted()
  } catch (e) {
    console.error(e)
  }
}

const onVisible = () => !minted.value && getMinted()
const ganImgURL = hash => `https://ipfs.io/ipfs/${hash}`
</script>

<template lang="pug">
section#machines.machine-nfts.grooved-cell.lg_mx-28(v-intersect, @intersect="onVisible")
  .py-28.px-12
    h3.text-24.font-bold Cosmic Inspirations

    .mt-24.mx-24
      .p-12
        | Logos summoned by <b>Cosmographia's</b> text-to-image AI<br class="hidden sm_inline">
        | based on {{ company.name }}'s description:<br>
        .my-12
          i {{ company.description }}
        | Minted {{ (minted && minted.length) || '...' }}/{{ editionSize || '...' }}
        | <br>0.1 ETH

    .mt-12
      button(@click="mintMachine", :disabled="isSoldOut")
        btn.px-24 Mint Cosmic Logo

    .mt-24
      template(v-if="minted === undefined")
        | Loading minted...

      template(v-else)
        ul.flex.flex-wrap.items-start.justify-center
          //- (preview gif)
          li.w-1x2.sm_w-1x3.p-12.my-12(v-if="!isSoldOut")
            img.max-w-full.opacity-25.cursor-pointer(src="/inspos.gif", alt="NFT preview", @click="mintMachine", style="width:256px")
            .mt-12 ???
          //- printed...
          template(v-if="minted")
            li.w-1x2.sm_w-1x3.p-12.my-12(v-for="(hash, i) in minted")
              nft-machine(:no="i + 1", :registration="props.registrations.find(regis => regis.tokenId === (company.id * 100 + i + 1).toString())")
                img.max-w-full(:src="ganImgURL(hash)")

</template>
