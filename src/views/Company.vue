<script setup>
import { ref, provide, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import list from '../../content/companies.js'
import store from '@/store'
import Btn from '@/components/Btn'
import NftGuile from '@/components/NFTGuile'
import MachineNfts from '@/components/MachineNFTs'

const route = useRoute()
const guileOwner = ref()

const company = list.find(com => com.name === route.params.company)
const isPetsDotCom = company.name === 'pets.com'
const ensDomain = isPetsDotCom ? 'petsdotcom.eth' : company.name.split(',')[0] + '.eth'
const subdomain = ref('')

const guileImgURL = '/art/' + route.params.company + '/guile.jpg'

const getOwner = () => {
  store.dispatch('getNFTOwner', company.id)
    .then(o => { guileOwner.value = o })
    .catch(console.error)
}

onBeforeMount(() => getOwner())
provide('company', company)
</script>

<template lang="pug">
article.company.flex.flex-wrap
  //- center column
  section.flex-1.grooved-cell.mb-3.lg_mb-0.relative
    .pb-32
      //- (mobile jump to ENS)
      router-link.lg_hidden.absolute.top-0.right-0.text-12.text-yellow.p-3.pb-6.text-13.font-sans.opacity-75.notouch_hover_opacity-100(to="#ens-registration") ENS Registration...

      header.text-16.mt-40.lg_mt-32
        h2.font-bold.text-28 {{ company.name }}
        p
          | {{ company.years }}
          template(v-if="guileOwner") , 2021-

        p.px-12.mt-24 {{ company.description }}

        .mt-24
          | CEO<br>
          | {{ guileOwner ? $store.getters.addrShort(guileOwner) : '???' }}

      //- logo progression
      .my-56.sm_flex.justify-center.w-full.text-15
        //- original
        .w-full.sm_w-1x3.mb-20
          h5.font-bold.mb-12 {{ company.years.split('–')[0] }} Logo
          .px-6
            a(:href="`/art/${company.name}/_original.png`", target="_blank")
              img.block.mx-auto(style="height:200px", :src="`/art/${company.name}/_original.png`")
        //- (cosmic inspo)
        .w-full.sm_w-1x3.mb-20(v-if="!isPetsDotCom")
          h5.font-bold.mb-12 Cosmic Inspiration
          .px-6
            a(:href="`/art/${company.name}/inspo.png`", target="_blank")
              img.block.mx-auto(style="height:200px", :src="`/art/${company.name}/inspo.png`")
        //- guile
        .w-full.sm_w-1x3.mb-20
          h5.font-bold.mb-12 Twardowski Revival
          .px-6
            a(:href="guileImgURL", target="_blank")
              img.block.mx-auto(style="height:200px", :src="guileImgURL")

      nft-guile.mt-64(:company="company", :owner="guileOwner", @mint="getOwner")

      machine-nfts.mt-36(v-if='!isPetsDotCom')

  //- right column
  aside#ens-registration.grooved-cell.w-full.lg_w-1x4.lg_ml-3
    h4.my-16.text-18.font-avara.font-bold.text-yellow ENS Registration

    p Any <b>{{ company.name }}</b> logo owner can register a subdomain on the company's <b class="text-yellow">{{ ensDomain }}</b> <a class="underline" href="https://ens.domains/" target="_blank" rel="noopener noreferrer">ENS&nbsp;domain</a>.

    form.mt-24(@submit.prevent, validate)
      label.w-full.text-14.font-sans(for="ens-subdomain-input") ENS Subdomain
      input.w-full.text-center.font-sans.border.border-medgray.bg-black.text-white.h-32(v-model="subdomain", id="ens-subdomain-input", name="ENS subdomain", placeholder="intern")

      .mt-4.font-sans.text-12.text-medgray(v-if="subdomain.length") {{subdomain}}.{{ensDomain}}

      .mt-16.text-center
        button
          btn.px-24 Register

</template>

<style>
article.company{
  text-align: center;
}
</style>
