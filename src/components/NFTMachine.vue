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
    | {{ '#' + tokenId }}
    br
    | {{ $store.getters.addrShort(owner) }}

</template>
