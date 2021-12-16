<script setup>
import { ref, provide, inject } from 'vue'
import Nft from '@/components/NFT'
import Btn from '@/components/Btn'
import Addr from '@/components/Addr'

const props = defineProps(['no', 'registration'])
const company = inject('company')

const tokenId = company.id.toString() + ('0' + props.no).slice(-2)
const owner = ref()

const onOwnerFound = o => { owner.value = o }

provide('tokenId', tokenId)
</script>

<template lang="pug">
nft.machine-nft(@owner="onOwnerFound")
  a.text-lightgray.font-sans.mb-2(:href="$store.getters.openSeaLink({ token: tokenId })", target="_blank", rel="noopener noreferrer")
    .w-full.relative
      .pb-full.border.border-darkgray.relative
        .absolute.overlay.flex.items-center.justify-center.text-darkgray.text-12 Loading...
        //- image
        slot
  //- caption
  .mt-12.text-12.lg_text-14
    //- open sea link / ID
    div
      a.text-lightgray.font-sans.mb-2(:href="$store.getters.openSeaLink({ token: tokenId })", target="_blank", rel="noopener noreferrer") {{ '#' + tokenId }}#[span.text-darkgray.ml-px ↗]

    //- owner
    .mt-1
      span.font-sans.text-darkgray.mr-10.inline-block.lg_block.lg_mb-4 Owner
      //-
      addr.font-bold(v-if="owner", :address="owner", :youOn="true")
      span.font-bold(v-else) ...
      //- span.font-bold
        template(v-if="owner === $store.state.address") You
        template(v-else) {{ $store.getters.addrShort(owner) }}

    //- ens?
    a.block.mt-4(v-if="registration", :href="`https://app.ens.domains/name/${registration.subdomain}.${registration.domain}.eth`", target="_blank", rel="noopener noreferrer")
      span.font-sans.text-darkgray.mr-10.inline-block ENS
      span.font-bold.text-yellow {{ registration.subdomain }}
    //- .{{ registration.domain }}.eth

    //- regis btn
    div(v-if="owner === $store.state.address")
      router-link.inline-block(:to="{ hash: '#ens-registration', query: {prefill: tokenId }}")
        btn.mt-8.px-20 {{ registration ? 'Change' : 'Register' }} ENS

</template>
