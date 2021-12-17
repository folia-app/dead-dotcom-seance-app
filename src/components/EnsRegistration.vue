<script setup>
import { ref, inject, onMounted, watch, toRaw } from 'vue'
import { useRoute } from 'vue-router'
import Btn from '@/components/Btn'
import store from '@/store'
import Addr from '@/components/Addr'
const route = useRoute()
const emit = defineEmits(['current'])

const company = inject('company')
const isPetsDotCom = company.name === 'pets.com'
const ensDomain = isPetsDotCom ? 'petsdotcom.eth' : company.name.split('.')[0] + '.eth'

// inputs
const subdomain = ref('')
const tokenId = ref(isPetsDotCom ? 1 : '')

// update input on route ?prefill
watch(route, (to) => {
  if (to.query.prefill) {
    tokenId.value = to.query.prefill
  }
})

const currentRegis = ref([])
const formerRegis = ref([])

const getRegistrations = async () => {
  try {
    const allEvents = (await store.dispatch('getSubdomainEvents')).reverse()
    // filter by company...
    const events = allEvents.filter(({ returnValues }) => {
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
    emit('current', current)
    return allEvents
  } catch (e) {
    console.error(e)
  }
}

const submit = async () => {
  try {
    const name = toRaw(subdomain.value).trim()
    const match = name.match(/^[a-zA-z0-9][^\W_]+/)

    // invalid name
    if (!match || match[0].length !== name.length) {
      subdomain.value = ''
      throw new Error('Invalid subdomain: Letters and numbers only.')
    }

    // check if already registered
    // TODO - check based on tokenId since can be any company id?
    await getRegistrations()
    const lastRegis = currentRegis.value.find(regis => regis.subdomain === name)
    if (lastRegis) {
      throw new Error(`"${name}" is already an active subdomain on "${lastRegis.domain}.eth"`)
    }

    // check if connected...
    if (!store.state.address) await store.dispatch('connect')

    // check owner...
    const owner = await store.dispatch('getNFTOwner', tokenId.value)

    // !! is not owner
    if (!owner || owner !== store.state.address) {
      throw new Error(`Logo #${tokenId.value} is not in your wallet: ${store.state.address}`)
    }

    // submit tx...
    const tx = await store.dispatch('registerENSSubdomain', { name, tokenId: tokenId.value })

    // after tx
    console.log(tx)
    getRegistrations()
    // refresh opensea metadata
    store.dispatch('updateOpenSeaToken', tokenId.value)
  } catch (e) {
    console.error(e)
    alert(e.message)
  }
}

onMounted(() => getRegistrations())
</script>

<template lang="pug">
section
  h4.my-16.text-18.font-avara.font-bold.text-yellow ENS Registration

  p Each logo owner can claim a subdomain on the company's <a class="font-bold text-yellow underline" :href="`https://app.ens.domains/name/${ensDomain}/subdomains`" target="_blank" rel="noopener noreferrer">{{ ensDomain }}</a> ENS&nbsp;domain.

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
  template(v-for="list in [['Active', currentRegis], ['Retired', formerRegis]]")
    section(v-if="list[1].length", :class="{'opacity-50': list[0] === 'Retired'}")
      //- hr.mt-40
      h4.mt-48.mb-12.text-17.font-avara.font-bold {{ list[0] }}
      ul
        template(v-for="regis in list[1]")
          li.flex.justify-between.lg_flex-wrap.mb-4
            //- name
            .w-1x3.lg_w-auto.font-sans.text-darkgray.mr-12.text-left
              | {{ '#' + regis.tokenId }} #[span.text-10(v-if="regis.tokenId === company.id.toString()") CEO]
            //- tokenID
            .w-1x3.lg_w-full.lg_order-first
              a.text-yellow.font-bold.notouch_hover_underline(:href="`https://app.ens.domains/name/${regis.subdomain}.${regis.domain}.eth`", target="_blank", rel="noopener noreferrer")
                | {{ regis.subdomain }}
            //- owner
            .w-1x3.lg_w-auto.font-sans.text-darkgray.ml-12.text-right
              addr.notouch_hover_underline(:address="regis.tokenOwner", :youOn="true")
              //- a.notouch_hover_underline(:href="$store.getters.openSeaLink({ account: regis.tokenOwner })", target="_blank", rel="noopener noreferrer")
                | {{ $store.getters.addrShort(regis.tokenOwner) }}

</template>
