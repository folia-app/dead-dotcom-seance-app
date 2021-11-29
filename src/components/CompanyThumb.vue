<script setup>
import { ref, computed } from 'vue'
import Btn from '@/components/Btn'
import store from '@/store'

const props = defineProps(['company'])

const owner = ref()
const work = ref({})
const isSoldOutMachines = computed(() => work.value.printed ? Number(work.value.printed) >= Number(work.value.editions) : undefined)

const getOwner = (flush) => {
  if (owner.value === undefined || flush) {
    store.dispatch('getNFTOwner', props.company.id).then(addr => { owner.value = addr })
  }
}

const getWork = async (flush) => {
  store.dispatch('getWork', { id: props.company.id, flush })
    .then(wrk => { work.value = wrk })
}

const onVisible = () => {
  getOwner()
  getWork()
}

const mintGuile = () => {
  store.dispatch('mintGuile', { companyId: props.company.id })
    .then(receipt => {
      console.log('tx', receipt)
      getWork(true)
      getOwner(true)
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
  router-link(:to="`/` + company.name")
    img(style="max-width:100%", :src="`/art/${company.name}/guile.jpg`", :alt="`${company.name} logo`")
  .mt-4.opacity-30.text-10.text-right Logo-NFT by Guile Twardowski

  h3.sr-only.mt-24.font-bold.text-24 {{ company.name }}

  div.mt-24.mb-20.text-16
    | <i>"{{ company.description }}"</i>
    .mt-20 {{ company.years }}
    .mt-20
      span CEO<br>
      template(v-if="owner")
        a.underline(:href="$store.getters.openSeaLink({ account: owner })", target="_blank", rel="noopener noreferrer")
          | {{ $store.getters.addrShort(owner) }}
      template(v-else-if="owner !== undefined") ???
      template(v-else) &nbsp;

  .mt-28.flex.flex-wrap.lg_flex-nowrap.w-full.justify-center.items-center
    //- i.px-16 Revive:
    button(:disabled="owner", :class="{'opacity-30': owner}", @click="mintGuile")
      btn.px-16 Mint Guile Logo ({{ owner ? '1' : '0' }}/1)<br>1 ETH
    button(:disabled="isSoldOutMachines", :class="{'opacity-30': isSoldOutMachines}", @click="mintMachine")
      btn.px-16
        | Mint Liminal Ghost ({{ work.printed || '...' }}/{{ work.editions || '...' }})
        <br>0.1 ETH

  .flex.mt-24.justify-center
    router-link(:to="`/` + company.name")
      btn.px-16.bg-darkgray.border-medgray View&nbsp;Company
  //- .mt-24
    .inline-block.py-10.text-14.underline View Company &rarr;
</template>
