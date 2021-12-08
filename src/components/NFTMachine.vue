<script setup>
import { ref, provide, inject } from 'vue'
import Nft from '@/components/NFT'
import Btn from '@/components/Btn'

const props = defineProps(['no', 'registration'])
const company = inject('company')

const tokenId = company.id.toString() + ('0' + props.no).slice(-2)
const owner = ref('...')

provide('tokenId', tokenId)
</script>

<template lang="pug">
nft.machine-nft(@owner="o => { owner = o }")
  a.text-lightgray.font-sans.mb-2(:href="$store.getters.openSeaLink({ token: tokenId })", target="_blank", rel="noopener noreferrer")
    //- image
    slot
  //- caption
  .mt-12.text-12.lg_text-14
    //- open sea link / ID
    div
      a.text-lightgray.font-sans.mb-2(:href="$store.getters.openSeaLink({ token: tokenId })", target="_blank", rel="noopener noreferrer") {{ '#' + tokenId }}

    //- owner
    a.block.mt-2(:href="$store.getters.openSeaLink({ account: owner })", target="_blank", rel="noopener noreferrer")
      span.font-sans.text-darkgray.mr-10.inline-block.lg_block.lg_mb-4 Owner
      span.font-bold
        template(v-if="owner === $store.state.address") You
        template(v-else) {{ $store.getters.addrShort(owner) }}

    //- ens?
    a.block.mt-4(:href="`https://app.ens.domains/name/${registration.subdomain}.${registration.domain}.eth`", target="_blank", rel="noopener noreferrer")(v-if="registration")
      span.font-sans.text-darkgray.mr-10.inline-block ENS
      span.font-bold.text-yellow {{ registration.subdomain }}
    //- .{{ registration.domain }}.eth

    //- regis btn
    div(v-if="owner === $store.state.address")
      router-link.inline-block(:to="{ hash: '#ens-registration', query: {prefill: tokenId }}")
        btn.mt-8.px-20 {{ registration ? 'Change' : 'Register' }} ENS

</template>
