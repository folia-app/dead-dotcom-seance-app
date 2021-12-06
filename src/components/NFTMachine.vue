<script setup>
import { ref, provide, inject } from 'vue'
import Nft from '@/components/NFT'

const props = defineProps(['no'])
const company = inject('company')

const tokenId = company.id.toString() + ('0' + props.no).slice(-2)
const owner = ref('...')

provide('tokenId', tokenId)
</script>

<template lang="pug">
nft.machine-nft(@owner="o => { owner = o }")
  slot
  .mt-12.text-12.lg_text-14
    //- open sea link / ID
    div
      a.text-lightgray.font-sans.mb-2(:href="$store.getters.openSeaLink({ token: tokenId })", target="_blank", rel="noopener noreferrer") {{ '#' + tokenId }}
    | {{ $store.getters.addrShort(owner) }}

</template>
