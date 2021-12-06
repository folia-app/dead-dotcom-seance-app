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
.text-15.font-avara.w-full.max-w-breakpoint-xlff.mx-auto.p-8.text-center.leading-normal

  header
    .grooved-cell.mb-3.relative.flex.flex-col-reverse
      //- presents...
      .absolute.top-0.left-0.p-8.opacity-80.text-12.md_text-14
        <a class="italic" href="https://folia.app" target="_blank"><span class="underline">folia</span> presents</a>

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
          button.group.relative(@click="store.dispatch('disconnect')", title="Disconnect")
            btn
              .flex.items-center.pl-20.pr-14
                | {{ store.getters.addrShort(store.state.address) }}
                .ml-12(style="font-size:1.5em;line-height:.8; transform: translateY(-0.1em)") ×
        //- (connect btn)
        template(v-else)
          button(@click="store.dispatch('connect')")
            btn.px-20 Connect

  //- (mobile nav row)
  nav.flex.lg_hidden.my-3.text-14
    router-link(to="/").flex-1.grooved-cell.flex.h-64.items-center.justify-center
      .pt-4 Home
    button(@click="mobileMenu = !mobileMenu").flex-1.grooved-cell.flex.h-64.items-center.justify-center
      .pt-4 {{ mobileMenu ? 'Close' : 'Menu' }}

  //- body
  .w-full.lg_flex
    //- companies menu
    nav.lg_flex.w-full.lg_w-1x5.pr-3(:class="{'hidden': !mobileMenu}")
      .grooved-cell.w-full
        h4.my-16.text-18.font-avara.font-bold The Summoned
        ul.companies-menu.text-16.mb-20
          //- links...
          li(v-for="com in companies")
            router-link.notouch_hover_text-red.text-blue(:to="`/` + com.name")
              | {{ com.name }}
            template(v-if="com.name === 'pets.com'")
              br
              | ~

      //- h4.mt-28.text-18.font-avara.font-bold Pet Cemetery
        ul.companies-menu.text-16.text-blue.mb-20
          li
            router-link.notouch_hover_text-red(to="/pets.com") pets.com

    main#main.flex-1
      router-view(:key="$route.path")

  footer.mt-3.grooved-cell.h-200.flex.items-center.justify-center
    blockquote.font-hyper.type-blockquote
      | There are no bad ideas in tech, only bad timing
      br
      cite &ndash;Marc Andreesen&ndash;

</template>

<style lang="postcss">
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
/* scale font up */
@media (min-width: 1280px) {
  html {
    /* not sure why 18 and not 10.5... */
    font-size: calc(20/1280 * 100vh);
  }
}

.type-blockquote{
  @apply text-24 text-center mx-auto leading-none;
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
