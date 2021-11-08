<script setup>
const companies = [
  ['thirdvoice.eth', 1],
  ['alladvantage.eth', 0],
  ['bidland.eth', 0],
  ['bizbuyer.eth', 1],
  ['capacityweb.eth', 0],
  ['cashwars.eth', 0],
  ['contentville.eth', 0],
  ['cyberrebate.eth', 0],
  ['ecircles.eth', 0],
  ['efanshop.eth', 0],
  ['ehobbies.eth', 0],
  ['elaw.eth', 0],
  ['exchangepath.eth', 0],
  ['financialprinter.eth', 0],
  ['funbug.eth', 0],
  ['heavenlydoor.eth', 0],
  ['iharvest.eth', 0],
  ['misterswap.eth', 0],
  ['netmorf.eth', 0],
  ['popularpower.eth', 1],
  ['shoppinglist.eth', 0],
  ['stickynetworks.eth', 0],
  ['wingspanbank.eth', 0]
]
</script>

<template lang="pug">
#app
  header
    table(style="height:160px")
      tr
        td(style="vertical-align:center; text-align:center")
          h1 dead dotcom seance
  table
    tbody(style="vertical-align:top")
      tr
        td(width="20%")
          div(v-for="co in companies")
            router-link(:to="`/` + co[0]") {{ co[0] }}#[template(v-if="co[1]") *]
        td
          router-view
        td(width="20%")

  footer
    table(style="height:160px")
      tr
        td

</template>

<style>
html{
  -webkit-font-smoothing: none;
  background: #010101;
  color: white;
}
</style>

<style scoped>
  #app{
    width: 100%;
    /* max-width: 1024px; */
    /* margin: 0 auto; */
  }
  table{
    width:100%;
    /* border-collapse:  collapse; */
  }
  td, .site-header{
    border:  5px #888 groove;
    border-radius: 10px;
  }
</style>
