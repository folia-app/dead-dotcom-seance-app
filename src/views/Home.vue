<script setup>
import list from '../../content/companies.js'
import CompanyThumb from '@/components/CompanyThumb'

const companies = list
</script>

<template lang="pug">
article.home.flex.flex-wrap
  section.grooved-cell.flex-1
    section.px-12.text-16.pt-32
      //- div(style="margin:32px auto; width:75px; height:75px; border:1px solid #888; color: #333;font-size:12px") gif

      p.text-20
        i Join<br><br>Simon Denny<br>Guile Twardowski<br>Cosmographia<br><br>for an on-chain spiritism session<br>to revive ghosts burst in<br>the dot-com bubble.

      div.my-16 • • •

      p Twenty dotcom era companies have been summoned for revival.<br>Each company includes an <b>ENS domain</b>, <b>a new logo-NFT</b> designed by <b>Guile Twardowski</b>&mdash;the artist behind <a class="underline" href="https://www.cryptokitties.co/" target="_blank" rel="noopener noreferrer">Cryptokitties</a>&mdash;and a suite of hidden text-to-image logo-NFTs by <b>Cosmographia</b> that Guile drew inspiration&nbsp;from.

      p Minting <i>any</i> NFT allows you to <b>register a subdomain</b> on the company's new ENS domain. Owner of Guile's logo-NFT earns the title of CEO on each company's profile&nbsp;page.

      p No candles are needed for this web3 séance of web1 spirits!<br><br>...here, we run on gas.

      blockquote.mt-60.type-blockquote.font-hyper
        | Almost every dot-com idea from 1999 that failed will succeed
        br
        cite &ndash;Marc Andreessen&ndash;

    section.mt-112.sm_px-5.mb-5
      h2.mb-16.font-bold.text-32.animate-pulse The Summoned

      //- companies...
      company-thumb(v-for="com in companies", :company="com")

  aside.grooved-cell.w-full.lg_w-1x4.lg_ml-3
    h4.my-16.text-18.font-avara.font-bold The Mediums

    p <a class="underline" href="http://www.guile.work" target="_blank" rel="noopener noreferrer"><b>Guile Twardowski</b></a> is a NFT pioneer, the artist behind the beloved <a class="underline" href="https://www.cryptokitties.co/" target="_blank" rel="noopener noreferrer">CryptoKitties</a>. His work has been exhibited and discussed in galleries and institutions like the ZKM (Karlsruhe) and Schinkel Pavillon (Berlin) as well as being presented in France, Brazil, USA and Russia.

    hr.my-12

    p <a class="underline" href="http://simondenny.net/" target="_blank" rel="noopener noreferrer"><b>Simon Denny</b></a> has had exhibitions at Moma PS1 (NY), the Serpentine (London), the Hammer Museum (LA),  the Venice Biennale and has co-curated art and crypto exhibitions Proof of Work (2018) at Schinkel Pavillon and Proof of Stake (2021) at Kunstverein Hamburg.

    hr.my-12
    p <b>Cosmographia</b> is a text-to-image AI company founded in 2021.
</template>

<style>
</style>
