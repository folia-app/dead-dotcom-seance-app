<script setup>
import '@/style/index.css'
import { ref } from 'vue'
import SvgLogo from '@/components/SvgLogo1'
import SvgLogoMobile from '@/components/SvgLogo1Mobile'
import Btn from '@/components/Btn'
import list from '../content/companies.js'
import store from '@/store'

const companies = list

const mobileMenu = ref(false)

store.dispatch('init')
</script>

<template lang="pug">
.text-15.font-avara.w-full.max-w-breakpoint-xl.mx-auto.p-8.text-center.leading-normal

  header
    .grooved-cell.mb-3.relative.flex.flex-col-reverse
      //- presents...
      .absolute.top-0.left-0.p-8.opacity-80.text-12.md_text-14
        <i><a class="underline" href="https://folia.app" target="_blank">folia</a> presents</i>

      //- logo row
      div
        .w-full.md_w-11x12.mx-auto.px-2.mt-20.md_mt-0
          router-link.logo-pulse.block.w-full.px-12.sm_mx-auto(to="/")
            svg-logo-mobile.block.sm_hidden.w-full
            svg-logo.hidden.sm_block.w-full
        //- tagline
        .text-center.py-28.text-13.md_text-16.opacity-80
          i Guile Twardowski #[span.px-6.sm_px-12 • ]Simon Denny #[span.px-6.sm_px-12 • ]Cosmographia

      //-
      .w-full.flex.justify-end.mb-2
        //- (disconnect btn)
        template(v-if="store.state.address")
          button(@click="store.dispatch('disconnect')")
            btn(style="padding-left:20px; padding-right:20px")
              | {{ store.getters.addrShort(store.state.address) }}
        //- (connect btn)
        template(v-else)
          button(@click="store.dispatch('connect')")
            btn(style="padding-left:20px; padding-right:20px") Connect
        //- i
          | Guile Twardowski<br>
          | Simon Denny<br>
          | Liminal Labs

    //- nav.flex.h-80
      router-link.flex-1.grooved-cell.m-3.flex.items-center.justify-center(to="/")
        | Home

      router-link.flex-1.grooved-cell.m-3.flex.items-center.justify-center(to="/companies")
        | Dotcoms

      router-link.flex-1.grooved-cell.m-3.flex.items-center.justify-center(to="/about")
        | About

  //- (mobile nav)
  nav.flex.lg_hidden.my-3.text-14
    router-link(to="/").flex-1.grooved-cell.flex.h-64.items-center.justify-center
      .pt-4 Home
    button(@click="mobileMenu = !mobileMenu").flex-1.grooved-cell.flex.h-64.items-center.justify-center
      .pt-4 {{ mobileMenu ? 'Close' : 'Menu' }}

  .w-full.lg_flex
    nav.lg_block.w-full.lg_w-1x5.grooved-cell.mr-3(:class="{'hidden': !mobileMenu}")
      h4.my-16.text-18.font-avara.font-bold The Summoned
      ul.companies-menu.text-16.text-blue.mb-20
        //- links...
        li(v-for="com in companies")
          router-link.notouch_hover_text-red(:to="`/` + com.name") {{ com.name.split(".")[0] }}.com

    main#main.flex-1.grooved-cell
      router-view(:key="$route.path")

    aside.w-full.lg_w-1x5.lg_ml-3.grooved-cell
      h4.my-16.text-18.font-avara.font-bold The Mediums
      //- p
        i Awake the undead businesses of the dot com era with the artist behind Cryptokitties
      //- p Web3’s first iconic NFT artist reimagines the 2021 machine learning dreams of the 2001 dot com undead:
      //- p A generative text-to-image algorithm from Liminal Labs produces possible logos of twenty dot-com-crash-era companies from short descriptions.
      //- p <b>Guile Twardowski</b> – the artist who illustrated the cats for early NFT project Cryptokitties – chooses a favourite machine-produced logo for each company and draws a version in response.
      //- p Mint Guile’s logos or blind-mint one of the machine-produced logos of the Dotcom undead.
      //- p Each NFT purchase comes with an ENS subdomain of it’s undead company which the buyer chooses.

      //- hr.my-12

      p <a class="underline" href="http://www.guile.work" target="_blank" rel="noopener noreferrer"><b>Guile Twardowski</b></a> is a NFT pioneer, the artist behind the beloved <a class="underline" href="https://www.cryptokitties.co/" target="_blank" rel="noopener noreferrer">CryptoKitties</a>. His work has been exhibited and discussed in galleries and institutions like the ZKM (Karlsruhe) and Schinkel Pavillon (Berlin) as well as being presented in France, Brazil, USA and Russia.

      hr.my-12

      p <a class="underline" href="http://simondenny.net/" target="_blank" rel="noopener noreferrer"><b>Simon Denny</b></a> has had exhibitions at Moma PS1 (NY), the Serpentine (London), the Hammer Museum (LA),  the Venice Biennale and has co-curated art and crypto exhibitions Proof of Work (2018) at Schinkel Pavillon and Proof of Stake (2021) at Kunstverein Hamburg.

      hr.my-12
      p <b>Cosmographia</b> is a text-to-image AI company founded in 2021.

  footer.grooved-cell.h-200.flex.items-center.justify-center
    blockquote.font-hyper.type-blockquote
      | There are no bad ideas in tech, only bad timing
      br
      cite &ndash;Marc Andreesen&ndash;

</template>

<style>
.font-avara{
  @apply tracking-wider;
}
.font-avara.italic, .font-avara i{
  @apply tracking-wider;
}
html{
  font-size:  10.5px; /* rem */
  -webkit-font-smoothing: none;
  background: #010101;
  color: rgb(250,250,250);
}
#app{
  width: 100%;
  max-width: 1280px;
  margin:  0 auto;
  font-family: 'avara', serif;
  font-size: 14px;
  /* max-width: 1024px; */
  /* margin: 0 auto; */
}
/* .font-hyper{
  font-family: 'hyperscrypt', sans-serif;
} */
.type-blockquote{
  font-size: 21px;
  line-height: 1;
  text-align: center;
  margin: 2em auto;
  width: 85%;
}
cite{
  font-size: 0.55em;
  font-style: normal;
  display: inline-block;
  margin-top: 1em;
  background: white;
  color: black;
  line-height: 0.85;
}
.table-border-groove > * > tr > *,
.grooved-cell{
  border:  5px #888 groove;
  border-radius: 10px;
  padding: 6px;
}

/* web3 modal styling */
#WEB3_CONNECT_MODAL_ID .web3modal-modal-lightbox{
  font-family: 'avara', serif;
  z-index: 1000;
}

.logo-pulse {
  animation:  logopulse 10s linear infinite;
}
@keyframes logopulse {
  /* 0%{ opacity: 0; } */
  80% { opacity:1 }
  90% { opacity: 0 }
  100% { opacity: 1; }
}

p + p {
    margin-top:1.2em;
  }

button[disabled]{
  @apply cursor-not-allowed opacity-40;
}

</style>

<style scoped>

  /* .companies-menu a:hover{ color: red; } */
  .companies-menu a:visited:not(:hover):not(.router-link-active){ color: purple; }
  .companies-menu a.router-link-active{ color: red; }
</style>
