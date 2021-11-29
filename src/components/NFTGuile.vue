<script setup>
import { ref, onMounted } from 'vue'
import Btn from '@/components/Btn'
import store from '@/store'

const props = defineProps(['company'])

const owner = ref()
const guileImgURL = '/art/' + props.company.name + '/guile.jpg'

const mintGuile = async () => {
  try {
    const tx = await store.dispatch('mintGuile', props.company.id)
    console.log(tx)
    getOwner()
  } catch (e) {
    console.error(e)
  }
}

const getOwner = async () => {
  owner.value = await store.dispatch('getNFTOwner', props.company.id)
}

onMounted(() => getOwner())
</script>

<template lang="pug">
div
  //- h5 Twardowski Revival
  div
    a(:href="guileImgURL", target="_blank")
      img.mx-auto.block(:src="guileImgURL", style="max-width:80%")
  div(style="margin-top:12px")
    //- (owner)
    //- template(v-if="owner")
      | {{ $store.getters.addrShort(owner) }}
    //- (buy)
    //- template(v-else)
    button(v-if="!owner", @click="mintGuile")
      btn(style="padding: 10px 44px; font-size: 1.05em;")
        | Mint CEO
</template>
