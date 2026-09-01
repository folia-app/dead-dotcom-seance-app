import companies from '../../content/companies' // works.FLA1000000, ...
import machines from '../../content/companies-machines'
// import Contract from 'folia-contracts/build/contracts/DeadDotComSeance.json'
import Contract from 'folia-contracts/build/contracts/DotComSeance.json'
import SubdomainRegistrar from 'subdomain-registrar/build/contracts/SubdomainRegistrar.json'
// import Web3 from 'web3'
import Eth from 'web3-eth'
require('dotenv').config()
// require('encoding') // netlify build error / missing package??

// TODO change to MAINNET @ launch
const fallbackNetworkId = process.env.VUE_APP_NETWORK_FALLBACK_ID || 1

const ipfsOrigin = process.env.VUE_APP_IPFS_ORIGIN

// infura endpoints
// Keyless. The Infura key that used to be here shipped in this public repo and
// in the client bundle; rinkeby no longer exists, so mainnet is all that is left
// to serve.
const infura = {
  1: 'https://gateway.tenderly.co/public/mainnet',
  4: 'https://gateway.tenderly.co/public/mainnet'
}

// Free, keyless endpoints that answer CORS preflights, benchmarked across
// sixteen candidates. Order is preference; each is a fallback for the one
// before it. A single keyed provider is what silently broke this project's
// metadata — its eth_getLogs cap made every token publish "-" as its ENS name.
const RPCS = (process.env.VUE_APP_RPCS || [
  'https://gateway.tenderly.co/public/mainnet',
  'https://mainnet.gateway.tenderly.co',
  'https://eth.drpc.org',
  'https://rpc.mevblocker.io',
  'https://ethereum-rpc.publicnode.com',
  'https://eth-mainnet.public.blastapi.io'
].join(',')).split(',').map((s) => s.trim()).filter(Boolean)

/**
 * A separate endpoint for reading historical logs.
 *
 * getENSSubdomain asks for every NewSubdomain event since block 0. Infura caps
 * eth_getLogs at 10,000 blocks and rejects that outright, and because the call
 * is wrapped in a try/catch returning '-', the failure never surfaced: it just
 * published `"ENS": "-"` in every token's metadata instead of the real
 * subdomain. Verified — the registrar has 115 NewSubdomain events, and the
 * live metadata for token 1 reads '-'.
 *
 * The endpoint below answers the whole range in about a second. Infura stays
 * for everything else here, since ordinary calls are unaffected.
 */
const logsRpc = {
  1: process.env.VUE_APP_LOGS_RPC || 'https://mainnet.gateway.tenderly.co',
  4: process.env.VUE_APP_LOGS_RPC || 'https://gateway.tenderly.co/public/mainnet'
}

// handler
exports.handler = async function (event, context) {
  try {
    // ?network=4
    const networkId = event.queryStringParameters.network || fallbackNetworkId

    const tokenId = event.path.substr(event.path.lastIndexOf('/') + 1) // 1,2... 201,202,...
    const isMachineSet = tokenId >= 100

    const isViewer = event.queryStringParameters.viewer === '1'
    const ignoreIsOwned = isViewer

    // _work ID in contract
    const editionId = isMachineSet ? Math.floor(tokenId / 100) // machines (1, 2...)
      : 0 // guiles (0)

    // find company
    const companyId = isMachineSet ? editionId : tokenId
    const company = companies.find(co => co.id.toString() === companyId.toString())

    // !! company doesn't exist
    if (!company) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Company not found.', companyId, networkId })
      }
    }

    const appUrl = `${process.env.VUE_APP_CANONICAL_DOMAIN}/${company.name}`

    // defaults
    let meta = {
      external_url: appUrl, // opensea
      home_url: appUrl // rarebits
    }

    // build meta...
    if (isMachineSet) {
      // machine meta..

      // get image
      const printId = tokenId - (editionId * 100) // 201 -> 1
      let image = machines[company.name][printId - 1]
      if (!image) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: "Doesn't exist" })
        }
      }
      image = `${ipfsOrigin}/ipfs/${image[1]}`

      // check if machine minted...
      const owner = await getNFTOwnerByTokenId(tokenId, networkId)

      // !! not yet minted (stay hidden)
      if (!owner) {
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Hidden until minted.', networkId })
        }
      }

      // Machine meta...
      meta = {
        name: `${company.name} (${company.years}) reimagined by Cosmographia, with Simon Denny and Guile Twardowski`,

        description: `Logo reimagined by Cosmographia's text-to-image machine learning (Diffusion Model) software for **${company.name}** (${company.years}) from the description "A logo for a 2001 company named '${company.name}' ${company.description}".\n\n[**Dotcom Seance**](https://dotcomseance.com) is a collection by Simon Denny, Guile Twardowski, and Cosmographia. \n\nPresented by [Folia](https://folia.app).`,

        image: image,
        image_url: image,

        properties: {
          dotcom: company.name,
          medium: 'Cosmographia'
        },

        ...meta
      }
    } else {
      // Guile NFT...

      const hash = 'QmPKNVntZAwX1QUED7ArTvKDeRrJgREaj82GSAuhshG8LB'
      // TODO - fix ipfs folder with mrswap rename
      const name = company.name === 'mrswap.com' ? 'misterswap.com' : company.name
      const image = `${ipfsOrigin}/ipfs/${hash}/${name}/guile.jpg`
      const inspoUrl = `${ipfsOrigin}/ipfs/${hash}/${name}/inspo.png`

      // Guile meta...
      meta = {
        name: `${company.name} (${company.years}) reimagined by Guile Twardowski, with Simon Denny and Cosmographia`,

        description: `Guile Twardowski reimagined logo for **${company.name}** (${company.years}) ${company.description}. ${company.id > 1 ? `Inspired from [a logo](${inspoUrl}) generated by Cosmographia's text-to-image AI. ` : ''}\n\n[**Dotcom Seance**](https://dotcomseance.com) is a collection by Simon Denny, Guile Twardowski, and Cosmographia. \n\nPresented by [Folia](https://folia.app).`,

        image,
        image_url: image,

        properties: {
          company: company.name,
          medium: 'Guile Twardowski'
        },

        ...meta
      }
    }

    // add ENS subdomain property...
    const subdomain = await getENSSubdomain(tokenId, networkId)
    console.log('sub', subdomain)
    meta.properties.ENS = subdomain

    return {
      statusCode: 200,
      body: JSON.stringify(meta)
    }

  // errors...
  } catch (e) {
    console.error(e)
    return {
      statusCode: 500,
      body: JSON.stringify({ status: 500, message: 'Internal Server Error', error: e.message })
    }
  }
}

// HELPERS

// helper for URL for individual asset
// const asset = (work, tokenId, key) => {
//   let asset = null
//   const file = work && work.tokens && work.tokens[tokenId] && work.tokens[tokenId][key]
//   if (file) {
//     const path = work.assetPath || ''
//     asset = path + file
//   }
//   return asset
// }

// formating print no. in title
// const printNo = (work, tokenId) => {
//   // get work namespace
//   const workNamespace = Math.floor(tokenId / 1000000) * 1000000 // 2000000
//   // get print no
//   let printNo = tokenId - workNamespace // 16

//   // format
//   if (printNo > work.editions) {
//     // artist proofs "(AP1)"
//     printNo = `(AP${printNo - work.editions})`
//   } else if (work.generative) {
//     // generative "#1"
//     printNo = `#${printNo}`
//   } else {
//     // default/edition "(1/9)"
//     printNo = `(${printNo}/${work.editions})`
//   }

//   return printNo
// }

// get token owner (check if token minted...)
async function getNFTOwnerByTokenId (tokenId, networkId) {
  let owner
  try {
    const eth = new Eth(String(networkId) === '1' ? RPCS[0] : infura[networkId])
    // setup contract
    const contract = new eth.Contract(
      Contract.abi,
      Contract.networks[networkId].address
    )
    owner = await contract.methods.ownerOf(tokenId).call()
    return owner
  } catch (e) {
    // will throw error if no owner...
    // console.error(e)
    return null
  }
}

async function getENSSubdomain (tokenId, networkId) {
  try {
    const eth = new Eth(String(networkId) === '1' ? RPCS[0] : (logsRpc[networkId] || infura[networkId]))
    const contract = new eth.Contract(
      SubdomainRegistrar.abi,
      SubdomainRegistrar.networks[networkId].address
    )
    // get all regis events...
    const events = await contract.getPastEvents('NewSubdomain', { fromBlock: 0 })
    // find last regis values
    events.reverse()
    let lastRegis = events.find(e => e.returnValues.tokenId === tokenId) || {}
    lastRegis = lastRegis.returnValues || {}

    return lastRegis.subdomain ? `${lastRegis.subdomain}.${lastRegis.domain}.eth` : '-'
  } catch (e) {
    console.error('@getENSSubdomain', e)
    return '-'
  }
}
