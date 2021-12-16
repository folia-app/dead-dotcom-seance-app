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
const infura = {
  1: 'https://mainnet.infura.io/v3/1363143c08464562ba87cc807ac77020',
  4: 'https://rinkeby.infura.io/v3/1363143c08464562ba87cc807ac77020'
}

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
    const eth = new Eth(infura[networkId])
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
