<script setup>
import { ref, inject } from 'vue'
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
</script>

<template lang="pug">
.nft(v-intersect, @intersect="getOwner")
  slot
</template>
