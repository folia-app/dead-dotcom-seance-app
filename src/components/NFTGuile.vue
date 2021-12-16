<script setup>
import { ref } from 'vue'
import Btn from '@/components/Btn'
import store from '@/store'
import Addr from '@/components/Addr'

const props = defineProps(['company', 'owner', 'regis'])
const emit = defineEmits(['mint'])

const guileImgURL = '/art/' + props.company.name + '/guile.jpg'

const isPetsDotCom = props.company.name === 'pets.com'

const status = ref()
const mintGuile = async () => {
  try {
    status.value = 'Minting...'
    const tx = await store.dispatch('mintGuile', props.company.id)
    console.log(tx)
    status.value = 'Success!'
    setTimeout(() => { status.value = null }, 3000)
    emit('mint')
  } catch (e) {
    console.error(e)
    status.value = null
  }
}
</script>

<template lang="pug">
section#guile.grooved-cell.lg_mx-28
  .py-28.px-12
    h3.text-24.font-bold.mb-32 Twardowski Revival

    //- h5 Twardowski Revival
    div.w-full.sm_w-2x3.lg_w-11x12.mx-auto
      a(:href="guileImgURL", target="_blank")
        img.max-w-full.block.mx-auto(:src="guileImgURL", )
      //- .mt-4.opacity-30.text-10.text-right Logo-NFT by Guile Twardowski

    .grooved-cellff.mt-16.mx-24
      .p-12
        //- id
        .mt-8.text-lightgray.font-sans.mb-2 {{ '#' + company.id }}
        //- name
        h6.text-17.font-bold {{ props.company.name }}
        .mb-16 2021
        //- description
        | Logo redesigned by <b>Guile Twardowski</b>
        br
        template(v-if="isPetsDotCom")
          | <i>~ Without any cosmic inspiration ~</i>
          br
          br
          div(v-html="company.auctionInfo")

        template(v-else)
          | inspired by a logo summoned by
          br
          | Cosmographia's text-to-image AI<br>
          br
          | Minted {{ props.owner ? '1' : '0' }}/1

          template(v-if="!props.owner")
            br
            | 1 ETH

        //- owner? (not folia deployer)
        template(v-if="props.owner && (!isPetsDotCom || props.owner !== '0xaf2ce0962d1a4b1aab10f7faa62bbbca40a8ea53')")
          .font-sans.text-darkgray.text-13.mt-14 Owner/CEO
          addr.underline.font-bold(:address="props.owner", :youOn="true")
          //- a.font-bold.mt-2.underline(:href="$store.getters.openSeaLink({ account: props.owner })", target="_blank", rel="noopener noreferrer")
            | {{ props.owner === store.state.address ? 'You' : $store.getters.addrShort(props.owner) }}

          //- regis?
          template(v-if="regis")
            .font-sans.text-darkgray.text-13.mt-14 ENS
            a.font-bold.mt-2.text-yellow.underline(:href="`https://app.ens.domains/name/${regis.subdomain}.${regis.domain}.eth`", target="_blank", rel="noopener noreferrer")
              | {{ regis.subdomain }}

    .mt-12.flex.justify-center.w-full
      //- (register)
      template(v-if="props.owner && props.owner === store.state.address")
        router-link(:to="{hash: '#ens-registration', query: { prefill: props.company.id }}")
          btn.px-24 {{ regis ? 'Change' : 'Register' }} ENS

      //- (auction link)
      template(v-else-if="isPetsDotCom")
        a(:href="$store.getters.openSeaLink({ token: 1 })", target="_blank", rel="noopener noreferrer")
          btn.px-24 Bid on OpenSea »

      //- (mint btn)
      template(v-else)
        button(@click="mintGuile", :disabled="props.owner")
          btn.px-24
            template(v-if="status") {{ status }}
            template(v-else) Mint Twardowski Logo
</template>
