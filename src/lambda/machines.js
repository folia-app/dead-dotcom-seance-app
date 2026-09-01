import companies from '../../content/companies' // works.FLA1000000, ...
import machines from '../../content/companies-machines'
import Controller from 'folia-contracts/build/contracts/DotComSeanceController.json'
// import Web3 from 'web3'
import Eth from 'web3-eth'
require('dotenv').config()
require('encoding') // netlify build error / missing package??
// const ignoreRelease = process.env.VUE_APP_DEV_IGNORE_RELEASES === 'true'

let ControllerContract

// TODO change to mainnet
const fallbackNetworkId = process.env.VUE_APP_NETWORK_FALLBACK_ID || 1

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

// handler
exports.handler = async function (event, context) {
  try {
    // const networkId = event.queryStringParameters.network ?? '1' // ?network=4
    const networkId = event.queryStringParameters.network || fallbackNetworkId
    const companyId = event.path.substr(event.path.lastIndexOf('/') + 1) // .../work/1 => 1

    const company = companies.find(co => co.id.toString() === companyId.toString()) || {}
    const images = machines[company.name]

    if (!images) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Images not found.', minted: false, networkId })
      }
    }

    // get work and figure out how many
    const work = await getWorkFromContract(companyId, networkId)

    // slice to what's been minted, map to just ipfshash
    const minted = images.slice(0, work.printed).map(row => row[1])

    return {
      statusCode: 200,
      body: JSON.stringify({ editionSize: work.editions, minted, networkId })
    }

  // errors...
  } catch (e) {
    console.error(e)
    return {
      statusCode: 500,
      body: JSON.stringify({ status: 500, message: 'Internal Server Error', error: e })
    }
  }
}

// HELPERS

async function getWorkFromContract (workId, networkId) {
  let work
  try {
    const eth = new Eth(String(networkId) === '1' ? RPCS[0] : infura[networkId])
    ControllerContract = new eth.Contract(
      Controller.abi,
      Controller.networks[networkId].address
    )
    work = await ControllerContract.methods._works(workId).call()
  } catch (e) {
    console.error(e)
  }
  return work
}
