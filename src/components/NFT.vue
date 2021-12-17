<script setup>
import { ref, inject, onMounted } from 'vue'
import store from '@/store'

const tokenId = inject('tokenId')

const emit = defineEmits(['owner'])

const owner = ref()
const getOwner = async () => {
  if (!owner.value) {
    owner.value = await store.dispatch('getNFTOwner', tokenId)
    emit('owner', owner.value)
  }
}

onMounted(() => {
  getOwner()
})
</script>

<template lang="pug">
//- .nft(v-intersect, @intersect="getOwner")
.nft
  div {{ tokenId }}
  div {{ $store.getters.addrShort(owner) }}
  slot
</template>
