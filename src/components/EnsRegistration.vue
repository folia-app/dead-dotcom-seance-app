<script setup>
import { ref, inject, onMounted } from 'vue'
import Btn from '@/components/Btn'
import store from '@/store'
const emit = defineEmits(['registrations'])

const company = inject('company')
const isPetsDotCom = company.name === 'pets.com'
const ensDomain = isPetsDotCom ? 'petsdotcom.eth' : company.name.split('.')[0] + '.eth'

// inputs
const subdomain = ref('')
const tokenId = ref(isPetsDotCom ? 1 : '')

const currentRegis = ref([])
const formerRegis = ref([])

const getRegistrations = async () => {
  try {
    let events = (await store.dispatch('getSubdomainEvents')).reverse()
    // filter by company...
    events = events.filter(({ returnValues }) => {
      return returnValues.domain === company?.name.split('.')[0] || (isPetsDotCom && returnValues.domain === 'petsdotcom')
    })

    const current = []
    const former = []
    events.forEach(({ returnValues }) => {
      if (!current.find(event => event.tokenId === returnValues.tokenId)) {
        current.push(returnValues)
      } else {
        former.push(returnValues)
      }
    })
    currentRegis.value = current
    formerRegis.value = former
    emit('registrations', { current, former })
  } catch (e) {
    console.error(e)
  }
}

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
    getRegistrations()
  } catch (e) {
    console.error(e)
    alert(e.message)
  }
}

onMounted(() => getRegistrations())
</script>

<template lang="pug">
section#ens-registration
  h4.my-16.text-18.font-avara.font-bold.text-yellow ENS Registration

  p Each logo owner can claim a subdomain on the company's <a class="font-bold text-yellow underline" :href="`https://app.ens.domains/name/${ensDomain}`" target="_blank" rel="noopener noreferrer">{{ ensDomain }}</a> ENS&nbsp;domain.

  form.mt-24(@submit.prevent="submit", validate)
    //- name input
    label.w-full.text-14.font-sans(for="ens-subdomain-input") Subdomain
    input.w-full.text-center.font-sans.border.border-medgray.bg-black.text-white.h-32(v-model="subdomain", id="ens-subdomain-input", name="ENS subdomain", placeholder="intern", required)

    .mt-4.font-sans.text-12.text-medgray
      | {{subdomain.length ? subdomain : 'intern' }}.{{ensDomain}}

    .mt-10(v-if="!isPetsDotCom")
      label.w-full.text-14.font-sans(for="token-id-input") Logo ID #
      input.w-full.text-center.font-sans.border.border-medgray.bg-black.text-white.h-32(v-model="tokenId", type="number", min="1", step="1", id="token-id-input", name="Logo ID #", placeholder="1", required, :hidden="isPetsDotCom")

    .mt-16.text-center
      button
        btn.px-24 Register

  //- list registrations
  template(v-for="list in [['Current', currentRegis], ['Former', formerRegis]]")
    section(v-if="list[1].length", :class="{'opacity-50': list[0] === 'Former'}")
      //- hr.mt-40
      h4.mt-48.mb-12.text-17.font-avara.font-bold {{ list[0] }}
      ul
        template(v-for="regis in list[1]")
          li.flex.justify-between.lg_flex-wrap.mb-4
            //- name
            .w-1x3.lg_w-auto.font-sans.text-darkgray.mr-12.text-left
              | {{ '#' + regis.tokenId }}
            //- tokenID
            .w-1x3.lg_w-full.lg_order-first
              a.text-yellow.font-bold.notouch_hover_underline(:href="`https://app.ens.domains/name/${regis.subdomain}.${regis.domain}.eth`", target="_blank", rel="noopener noreferrer")
                | {{ regis.subdomain }}
            //- owner
            .w-1x3.lg_w-auto.font-sans.text-darkgray.ml-12.text-right
              a.notouch_hover_underline(:href="$store.getters.openSeaLink({ account: regis.tokenOwner })", target="_blank", rel="noopener noreferrer")
                | {{ $store.getters.addrShort(regis.tokenOwner) }}

</template>
