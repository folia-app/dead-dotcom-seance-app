<script setup>
import { ref, computed } from 'vue'
import store from '@/store'
const props = defineProps(['address', 'youOn'])
const name = ref()
const isYou = computed(() => props.address.toLowerCase() === store.state.address.toLowerCase())
const onVisible = async () => {
  if (props.youOn && isYou.value) return
  if (!name.value) {
    name.value = await store.dispatch('getAddressName', props.address)
  }
}
</script>

<template lang="pug">
a.addr(v-intersect, @intersect="onVisible", :href="$store.getters.addrShort(props.address)", target="_blank", rel="noopener noreferrer")
  template(v-if="isYou && props.youOn") You
  template(v-else) {{ name || $store.getters.addrShort(props.address) }}
</template>
