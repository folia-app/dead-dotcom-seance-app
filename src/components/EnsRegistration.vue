<script setup>
import { ref, inject, onMounted } from 'vue'
import Btn from '@/components/Btn'
import store from '@/store'

const company = inject('company')
const isPetsDotCom = company.name === 'pets.com'
const ensDomain = isPetsDotCom ? 'petsdotcom.eth' : company.name.split('.')[0] + '.eth'

// inputs
const subdomain = ref('')
const tokenId = ref(isPetsDotCom ? 1 : '')

const submit = async () => {
  try {
    if (!store.state.address) await store.dispatch('connect')

    // check owner...
    const owner = await store.dispatch('getNFTOwner', tokenId.value)

    // !! is not owner
    if (!owner || owner !== store.state.address) {
      throw new Error(`Logo #${tokenId.value} is not in your wallet: ${store.state.address}`)
    }

    const tx = await store.dispatch('registerENSSubdomain', { name: subdomain.value, tokenId: tokenId.value })

    console.log(tx)
  } catch (e) {
    console.error(e)
    alert(e.message)
  }
}

onMounted(async () => {
  console.log('eventss', await store.dispatch('getSubdomainEvents'))
})
</script>

<template lang="pug">
section#ens-registration
  h4.my-16.text-18.font-avara.font-bold.text-yellow ENS Registration

  p A subdomain on the company's <a class="font-bold text-yellow underline" :href="`https://app.ens.domains/name/${ensDomain}`" target="_blank" rel="noopener noreferrer">{{ ensDomain }}</a> ENS&nbsp;domain can be claimed by each logo owner.

  form.mt-24(@submit.prevent="submit", validate)
    //- name input
    label.w-full.text-14.font-sans(for="ens-subdomain-input") ENS Subdomain
    input.w-full.text-center.font-sans.border.border-medgray.bg-black.text-white.h-32(v-model="subdomain", id="ens-subdomain-input", name="ENS subdomain", placeholder="intern", required)

    .mt-4.font-sans.text-12.text-medgray
      | {{subdomain.length ? subdomain : 'intern' }}.{{ensDomain}}

    .mt-10(v-if="!isPetsDotCom")
      label.w-full.text-14.font-sans(for="token-id-input") Logo ID #
      input.w-full.text-center.font-sans.border.border-medgray.bg-black.text-white.h-32(v-model="tokenId", type="number", min="1", step="1", id="token-id-input", name="Logo ID #", placeholder="1", required, :hidden="isPetsDotCom")

    .mt-16.text-center
      button
        btn.px-24 Register
</template>
