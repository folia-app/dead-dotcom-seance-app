<script setup>
import '@/style/index.css'
import SvgLogo from '@/components/SvgLogo1'
import Btn from '@/components/Btn'
import list from '../content/companies.js'
import store from '@/store'

const companies = list

store.dispatch('init')
</script>

<template lang="pug">
header
  table.table-border-groove(style="height:200px; font-size:14px")
    tbody
      tr
        td(style="vertical-align:center; text-align:center; position: relative")
          div(style="position:absolute;top:0;left:0;padding:8px; opacity:0.85")
            <i><a href="https://folia.app" target="_blank" style="color:white;">folia</a> presents</i>
          div
            router-link(to="/", style="color:inherit;text-decoration:none")
              svg-logo(style="height:3.9rem; margin-top:24px")
            div(style="padding-top:28px; font-size: 1.125em; opacity:0.85; padding-right:2em")
              i Guile Twardowski #[span(style="padding:0 24px") • ]Simon Denny #[span(style="padding:0 24px") • ]Liminal Labs
          div(style="position:absolute;top:0;right:0;padding:8px 6px; text-align:right")
            template(v-if="store.state.address")
              button(@click="store.dispatch('disconnect')")
                btn(style="padding-left:20px; padding-right:20px")
                  | {{ store.getters.addrShort(store.state.address) }}
            template(v-else)
              button(@click="store.dispatch('connect')")
                btn(style="padding-left:20px; padding-right:20px") Connect
            //- i
              | Guile Twardowski<br>
              | Simon Denny<br>
              | Liminal Labs
table.table-border-groove
  tbody(style="vertical-align:top")
    tr
      //- left column
      td(width="20%" style="padding:0 6px; text-align:center")
        h4(style="text-align:center") The Undead
        ul.companies-menu(style="list-style-type:none; padding:0; font-size: 1.125em")
          //- links...
          li(v-for="com in companies")
            router-link(:to="`/` + com.name") {{ com.name.split(".")[0] }}#[span(style="opacity:1") .com#[template(v-if="com.guile") *]]

      //- main column (route)
      td
        router-view(:key="$route.path")

      //- right column
      td(width="20%" style="padding:0 6px; text-align:center")
        p
          i Awake the undead businesses of the dot com era with the artist behind Cryptokitties
        //- p Web3’s first iconic NFT artist reimagines the 2021 machine learning dreams of the 2001 dot com undead:
        //- p A generative text-to-image algorithm from Liminal Labs produces possible logos of twenty dot-com-crash-era companies from short descriptions.
        //- p <b>Guile Twardowski</b> – the artist who illustrated the cats for early NFT project Cryptokitties – chooses a favourite machine-produced logo for each company and draws a version in response.
        //- p Mint Guile’s logos or blind-mint one of the machine-produced logos of the Dotcom undead.
        //- p Each NFT purchase comes with an ENS subdomain of it’s undead company which the buyer chooses.

        hr

        p <b>Guile Twardowski</b> is a NFT pioneer, the artist behind the beloved <a href="https://www.cryptokitties.co/" target="_blank" rel="noopener noreferrer">CryptoKitties</a> project. His projects have been exhibited and discussed in galleries and institutions like the ZKM (Karlsruhe) and Schinkel Pavillon (Berlin) as well as being presented in France, Brazil, USA and Russia.

        hr
        p <a href="http://simondenny.net/" target="_blank" rel="noopener noreferrer"><b>Simon Denny</b></a> has had exhibitions at Moma PS1 (NY), the Serpentine (London), the Hammer Museum (LA),  the Venice Biennale and has co-curated art and crypto exhibitions Proof of Work (2018) at Schinkel Pavillon and Proof of Stake (2021) at Kunstverein Hamburg.

        hr
        p <b>Liminal Labs</b> is a text-to-image AI company founded in 2021 by David Holz

footer
  table.table-border-groove(style="height:180px")
    tfoot
      tr
        td(style="vertical-align:center; ")
          blockquote.font-hyper.type-blockquote
            | There are no bad ideas in tech, only bad timing
            br
            cite &ndash;Marc Andreesen&ndash;

</template>

<style>
html{
  -webkit-font-smoothing: none;
  background: #010101;
  color: white;
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
.font-hyper{
  font-family: 'hyperscrypt', sans-serif;
}
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

</style>

<style scoped>
  table{
    width:100%;
    /* border-collapse:  collapse; */
  }
  p + p {
    margin-top:1.2em;
  }
  .companies-menu .router-link-active{
    color: red;
  }
  .companies-menu a:hover{
    color: red;
  }
</style>
