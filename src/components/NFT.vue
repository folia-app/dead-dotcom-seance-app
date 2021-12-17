<script setup>
import { ref, inject, onMounted } from 'vue'
import store from '@/store'

const tokenId = inject('tokenId')

const emit = defineEmits(['owner'])

let owner
const getOwner = async () => {
  if (!owner) {
    owner = await store.dispatch('getNFTOwner', tokenId)
    emit('owner', owner)
  }
}

onMounted(() => {
  getOwner()
})
</script>

<template lang="pug">
//- .nft(v-intersect, @intersect="getOwner")
.nft
  slot
</template>
