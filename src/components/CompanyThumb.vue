<script setup>
import { ref, computed } from 'vue'
import Btn from '@/components/Btn'
import Addr from '@/components/Addr'
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

const guileStatus = ref()
const mintGuile = () => {
  guileStatus.value = 'Minting...'
  store.dispatch('mintGuile', props.company.id)
    .then(receipt => {
      console.log('tx', receipt)
      guileStatus.value = 'Success!'
      setTimeout(() => { guileStatus.value = null }, 3000)
      getWork(true)
      getCEO(true)
    })
    .catch(() => {
      guileStatus.value = null
      getWork(true)
      getCEO(true)
    })
}

const machineStatus = ref()
const mintMachine = () => {
  machineStatus.value = 'Minting...'
  store.dispatch('mintMachine', props.company.id)
    .then(receipt => {
      console.log('tx', receipt)
      machineStatus.value = 'Success!'
      setTimeout(() => { machineStatus.value = null }, 3000)
      getWork(true)
    })
    .catch(() => {
      getWork(true)
      machineStatus.value = null
    })
}

</script>

<template lang="pug">
.grooved-cell.mb-3(v-intersect="0.01", @intersect="onVisible")
  .flex.justify-center
    .relative.text-medgray.text-10.sm_text-11
      //- guile
      figure
        router-link(:to="`/` + company.name")
          img.block.mx-auto(style="max-width:100%", :src="`/art/${company.name}/guile.jpg`", :alt="`${company.name} logo`")
        figcaption.mt-4.text-right <b>Guile Twardowski</b> Logo

      //- (pulsing gan overlay)
      template(v-if="!isPetsDotCom")
        figure.absolute.overlay.animate-pulse0.pointer-events-none
          img.w-full(:src="`/art/${company.name}/inspo.png`")
          figcaption.mt-4.text-left.bg-black Inspired <b>Cosmic Logo</b> by Cosmographia

  h3.mt-28.font-bold.text-20
    router-link(:to="`/` + company.name")
      | {{ company.name }}

  //- years
  .mt-4 {{ company.years }}

  div.mt-16.mb-20.text-16
    //- description
    div.sm_px-12(v-html="company.description")

    //- (auction info)
    div.mt-14.px-6(v-if="company.auctionInfo", v-html="company.auctionInfo")

    //- ceo
    .mt-20
      span CEO<br>
      template(v-if="ceo && (!isPetsDotCom || ceo !== '0x2F5866D7215416Fa60beDF532856736Cd9a76acf'.toLowerCase())")
        addr.underline(:address="ceo", :youOn="true")
        //- a.underline(:href="$store.getters.openSeaLink({ account: ceo })", target="_blank", rel="noopener noreferrer")
          | {{ $store.getters.addrShort(ceo) }}
      template(v-else-if="ceo !== undefined") ???
      template(v-else) &nbsp;

  .mt-28.flex.flex-wrap.lg_flex-nowrap.w-full.justify-center.items-center
    //- pets.com
    template(v-if="isPetsDotCom")
      a(:href="$store.getters.openSeaLink({ token: 1 })", target="_blank", rel="noopener noreferrer")
        btn.px-24 Bid on OpenSea »

    //- default com
    template(v-else)
      //- mint machine btn
      button(:disabled="isSoldOutMachines", :class="{'opacity-30': isSoldOutMachines}", @click="mintMachine")
        btn.px-16
          template(v-if="machineStatus") {{ machineStatus }}
          template(v-else)
            | Mint Random Cosmic Logo ({{ work.printed || '...' }}/{{ work.editions || '...' }})
            <br>0.1 ETH
      //- mint buile btn
      button(:disabled="ceo", :class="{'opacity-30': ceo}", @click="mintGuile")
        btn.px-16
          template(v-if="guileStatus") {{ guileStatus }}
          template(v-else)
            | Mint the Twardowski Logo ({{ ceo ? '1' : '0' }}/1)<br>1 ETH

  .flex.mt-24.justify-center
    router-link(:to="`/` + company.name")
      btn.px-16.bg-darkgray.border-medgray View&nbsp;Company »
  //- .mt-24
    .inline-block.py-10.text-14.underline View Company &rarr;
</template>
