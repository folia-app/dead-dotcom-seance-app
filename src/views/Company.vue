<script setup>
import { ref, provide, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import list from '../../content/companies.js'
import store from '@/store'
import Btn from '@/components/Btn'
import NftGuile from '@/components/NFTGuile'
import MachineNfts from '@/components/MachineNFTs'
import ArtistBios from '@/components/ArtistBios'
import EnsRegistration from '@/components/EnsRegistration'

const route = useRoute()
const guileOwner = ref()

const company = list.find(com => com.name === route.params.company)
const isPetsDotCom = company.name === 'pets.com'
const staff = ref([])

const guileImgURL = '/art/' + route.params.company + '/guile.jpg'
const originalLogoNotFound = ref(false)

const getOwner = () => {
  store.dispatch('getNFTOwner', company.id)
    .then(o => { guileOwner.value = o })
    .catch(console.error)
}

// const onENSList = ({ current }) => { staff.value = current }

onBeforeMount(() => getOwner())
provide('company', company)
</script>

<template lang="pug">
article.company.flex.flex-wrap
  //- center column
  .flex-1
    section.grooved-cell.mb-3.lg_mb-0.relative
      .pb-32
        //- (mobile jump to ENS)
        router-link.lg_hidden.absolute.top-0.right-0.text-12.text-yellow.p-3.pb-6.text-13.font-sans.opacity-75.notouch_hover_opacity-100(to="#ens-registration") ENS Registration...

        header.text-16.mt-40.lg_mt-32
          h2.font-bold.text-28 {{ company.name }}
          p
            | {{ company.years }}
            template(v-if="guileOwner") , 2021-

          p.px-12.mt-24(v-html="company.description")

          .mt-24
            | CEO<br>
            | {{ guileOwner ? $store.getters.addrShort(guileOwner) : '???' }}

        //- logo progression
        .my-56.sm_flex.justify-center.w-full.text-15
          //- original
          .w-full.sm_w-1x3.mb-20
            h5.font-bold.mb-12 {{ company.years.split('–')[0] }} Logo
            .px-6
              template(v-if="!originalLogoNotFound")
                a(:href="`/art/${company.name}/_original.png`", target="_blank")
                  img.block.mx-auto(style="height:200px", :src="`/art/${company.name}/_original.png`", @error="originalLogoNotFound = true")
              template(v-else)
                span.text-darkgray.text-14 Unknown
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

    //- (artist bios laptop)
    .grooved-cell.mt-3.w-full.hidden.lg_block
      .pb-6
        artist-bios

  //- right column
  aside.grooved-cell.w-full.lg_w-1x4.lg_ml-3
    ens-registration

  //- (artist bios mobile)
  .grooved-cell.w-full.mt-3.lg_hidden
    artist-bios

</template>

<style>
article.company{
  text-align: center;
}
</style>
