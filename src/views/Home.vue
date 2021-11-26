<script setup>
import list from '../../content/companies.js'

const companies = list
</script>

<template lang="pug">
.home(style="text-align:center;")
  div(style="margin:32px auto; width:75px; height:75px; border:1px solid #888; color: #333;font-size:12px") gif

  p(style="font-size: 1.2em;")
    i Join Simon Denny, Guile Twardowski, and Liminal Labs<br>for an on-chain spiritism session to bring back buried companies,<br>the casualties of the dot com bubble burst.

  div •••

  p Mint them back to life - each logo will be minted and includes an ens subdomain that grants the new owners the possibility to interact with other subdomain + NFT owners and experiment (or not), on the base of the spirits of start-ups past, present, and yet to come.

  p No candles are needed for this web3 seance of web1 spirits  - here, we run on gas.

  div(style="margin:32px auto 40px; width:75px; height:75px; border:1px solid #888; color: #333;font-size:12px") gif

  //- blockquote.type-blockquote.font-hyper
    | Almost every dot-com idea from 1999 that failed will succeed
    cite &ndash;Marc Andreessen&ndash;
    //- cite(style="display:block;margin-top: 0; font-style:italic; font-size: 12px ") Marc Andreessen

  p A generative text-to-image algorithm from Liminal Labs produces possible logos of twenty dot-com-crash-era companies from short text descriptions of the businesses.

  p <b>Guile Twardowski</b> – the artist who illustrated the cats for the early NFT project Cryptokitties – chooses a favorite machine-produced logo for each company and draws a version in response.

  p Mint Guile’s logos or blind-mint the machine-produced logos of the dot com undead.

  p The awakened start-up spirits get propelled from the burst bubble purgatory straight into the web3 universe - the KPI for this seance is your minting of the company logo NFT and its corresponding ENS subdomain, living on-chain forevermore.

  blockquote.type-blockquote.font-hyper
    | Almost every dot-com idea from 1999 that failed will succeed
    cite &ndash;Marc Andreessen&ndash;

  //- blockquote.font-hyper.type-blockquote
   | Any new technology tends to go through a 25-year adoption cycle.
   cite &ndash;Marc Andreessen&ndash;

  div(style="margin:32px auto; width:75px; height:75px; border:1px solid #888; color: #333;font-size:12px") gif

  //- table.table-border-groove(style="width:75%; margin: 0 auto;")
    tr
      td
        h4 Guile Twardowski
        p is the artist behind the early CryptoKitties (2017) NFT project. Aside from his work with Dapper Labs on other projects like Ceeze Wizards, his work has been exhibited in galleries and institutions like the ZKM (Karlsruhe) and Schinkel Pavillon (Berlin) as well as  in France, Brazil, USA and Russia.

    tr
      td
        h4 Simon Denny
        p is an artist and curator who has had exhibitions at Moma PS1 (NY), the Serpentine (London), the Hammer Museum (LA),  the Venice Biennale and has co-curated art and crypto exhibitions Proof of Work (2018) at Schinkel Pavillon and Proof of Stake (2021) at Kunstverein Hamburg.

    tr
      td Liminal Labs is a text-to-image AI company founded in 2021 by David Holz (tbc with David).

  table.table-border-groove(style="width:100%; padding:0 5px; margin-bottom:5px")
    thead
      tr
        th(colspan="2")
          h2(style="margin:20px 0 16px") The Undead

    tbody
      tr(v-for="com in companies")
        td
          table(style="width:100%")
            tr
              //- td(width="50%", style="vertical-align:center") {{ com.name }}
              td
                router-link(:to="`/` + com.name")
                  img(style="width:50%", :src="`/art/${com.name}/guile.jpg`")
</template>

<style>
.home{
  font-size:1.1em;
}
.home p {
  padding: 0 12px;
}
.home td {
  padding: 12px;
}
</style>
