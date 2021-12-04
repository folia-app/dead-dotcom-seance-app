<script setup>
import { ref, computed } from 'vue'
import Btn from '@/components/Btn'
import store from '@/store'

const props = defineProps(['company'])

const ceo = ref() // guile owner
const work = ref({})

const isPetsDotCom = props.company.name === 'pets.com'
const isSoldOutMachines = computed(() => work.value.printed ? Number(work.value.printed) >= Number(work.value.editions) : undefined)

const getCEO = (flush) => {
  if (ceo.value === undefined || flush) {
    store.dispatch('getNFTOwner', props.company.id)
      .then(addr => { ceo.value = addr })
  }
}

const getWork = async (flush = false) => {
  if (isPetsDotCom) return
  // get machines edition info...
  store.dispatch('getWork', { id: props.company.id, flush })
    .then(wrk => { work.value = wrk || {} })
}

const onVisible = () => {
  getCEO()
  getWork()
}

const mintGuile = () => {
  store.dispatch('mintGuile', { companyId: props.company.id })
    .then(receipt => {
      console.log('tx', receipt)
      getWork(true)
      getCEO(true)
    })
}

const mintMachine = () => {
  store.dispatch('mintMachine', props.company.id)
    .then(receipt => {
      console.log('tx', receipt)
      getWork(true)
    })
}

</script>

<template lang="pug">
.grooved-cell.mb-3(v-intersect="0.01", @intersect="onVisible")
  .flex.justify-center
    div
      router-link(:to="`/` + company.name")
        img.block.mx-auto(style="max-width:100%", :src="`/art/${company.name}/guile.jpg`", :alt="`${company.name} logo`")
      .mt-4.opacity-30.text-10.text-right Logo-NFT by Guile Twardowski

  h3.sr-only.mt-24.font-bold.text-24 {{ company.name }}

  div.mt-24.mb-20.text-16
    //- description
    div(v-html="company.description")
    //- years
    .mt-20 {{ company.years }}
    //- ceo
    .mt-20
      span CEO<br>
      template(v-if="ceo")
        a.underline(:href="$store.getters.openSeaLink({ account: ceo })", target="_blank", rel="noopener noreferrer")
          | {{ $store.getters.addrShort(ceo) }}
      template(v-else-if="ceo !== undefined") ???
      template(v-else) &nbsp;

  .mt-28.flex.flex-wrap.lg_flex-nowrap.w-full.justify-center.items-center
    //- pets.com
    template(v-if="isPetsDotCom")
      a(:href="props.company.auctionLink", target="_blank", rel="noopener noreferrer")
        btn.px-24 Bid on OpenSea »

    //- default com
    template(v-else)
      //- mint buile btn
      button(:disabled="ceo", :class="{'opacity-30': ceo}", @click="mintGuile")
        btn.px-16 Mint Guile Logo ({{ ceo ? '1' : '0' }}/1)<br>1 ETH
      //- mint machine btn
      button(:disabled="isSoldOutMachines", :class="{'opacity-30': isSoldOutMachines}", @click="mintMachine")
        btn.px-16
          | Mint Cosmic Logo ({{ work.printed || '...' }}/{{ work.editions || '...' }})
          <br>0.1 ETH

  .flex.mt-24.justify-center
    router-link(:to="`/` + company.name")
      btn.px-16.bg-darkgray.border-medgray View&nbsp;Company »
  //- .mt-24
    .inline-block.py-10.text-14.underline View Company &rarr;
</template>
