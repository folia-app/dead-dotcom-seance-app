import { createStore } from 'vuex'
// contracts
import DotComSeance from 'folia-contracts/build/contracts/DotComSeance.json'
import DotComSeanceController from 'folia-contracts/build/contracts/DotComSeanceController.json'
import SubdomainRegistrar from 'subdomain-registrar/build/contracts/SubdomainRegistrar.json'
// web3
import Web3 from 'web3'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
// import { exception } from 'vue-gtag'
// modules
// import prismic from './prismic'
// import auctions from './auctions'

const networks = {
  1: { name: 'mainnet', infura: 'wss://mainnet.infura.io/ws/v3/1363143c08464562ba87cc807ac77020' },
  4: { name: 'rinkeby', infura: 'wss://rinkeby.infura.io/ws/v3/1363143c08464562ba87cc807ac77020' }
}

const fallbackNetworkId = process.env.VUE_APP_NETWORK_FALLBACK_ID || 1
// TODO: better optimizaion: fallback based on contract deploy networks available?

let web3
let provider = window.ethereum || Web3.currentProvider || Web3.givenProvider

// provider options
const providerOptions = {
  /* See Provider Options Section */
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: '1363143c08464562ba87cc807ac77020' // required
    }
  }
}

// setup web3 modal
const web3Modal = new Web3Modal({
  network: fallbackNetworkId === '4' ? 'rinkeby' : null, // optional
  cacheProvider: true, // optional
  providerOptions // required
  // theme: 'dark'
})

let initializing = false
const requests = {}

export default createStore({
  state: {
    address: null,
    networkId: null,

    nftContract: null,
    controllerContract: null,
    registrarContract: null,
    // reserveAuctionContract: null,

    works: [],
    tokens: [],
    metadatas: [],
    names: {},

    isListening: false,
    lastMintEvent: null
  },
  getters: {
    weiToETH: () => (wei) => web3?.utils.fromWei(wei) ?? '-',
    ethToWei: () => (eth) => web3?.utils.toWei(eth) ?? '-',
    workId: () => (uid, prefix) => {
      const id = Number(uid) // / 1000000
      return prefix ? ('00' + id).slice(-3) // 001
        : id // 1 - for contract communication
    },
    addrShort: () => (addr) => addr ? addr.slice(0, 6) + '...' + addr.slice(-4) : '...',
    userBalance: (state) => (addr) => web3?.eth.getBalance(addr || state.address) || 0, // wei
    contractAddr: (state) => state.nftContract?._address,
    isSoldOut: () => (work) => {
      return work && Number(work.editions) && Number(work.printed) >= Number(work.editions)
    },
    openSeaLink: (state, getters) => ({ token, account }) => {
      const isTestnet = [4].includes(state.networkId)
      const path = token ? `/assets/${getters.contractAddr}/${token}`
        : account ? `/accounts/${account}`
          : ''
      return `https://${isTestnet ? 'testnets.' : ''}opensea.io` + path
    },
    meta: state => ({ title, descrip, img }) => {
      const meta = []
      // defaults
      const siteTitle = '~ DOTCOM SÉANCE ~'
      const siteDescrip = 'Join Guile Twardowksi, Simon Denny, and Cosmographia for an on-chain spiritism session to revive ghosts burst in the dot-com bubble ~ presented by folia.app'
      const siteImg = '/dotcom-seance-logo.jpg'
      // set
      title = title ? `${title} ${siteTitle}` : siteTitle
      descrip = descrip || siteDescrip
      img = img || siteImg
      img = process.env.VUE_APP_CANONICAL_DOMAIN + img
      // add
      meta.push({ type: 'property', name: 'og:title', content: title })
      meta.push({ type: 'property', name: 'og:site_name', content: siteTitle })
      meta.push({ type: 'property', name: 'og:type', content: 'website' })
      meta.push({ type: 'name', name: 'description', content: descrip })
      meta.push({ type: 'property', name: 'og:description', content: descrip })
      meta.push({ type: 'property', name: 'og:image', content: img })
      // twitter?
      meta.push({ type: 'name', name: 'twitter:card', content: 'summary_large_image' })
      meta.push({ type: 'name', name: 'twitter:domain', content: 'dotcomseance.com' })
      // meta.push({ property: 'og:url', content: ##ADDCANNONICAL## })

      // render
      document.title = title
      meta.forEach((item) => {
        let el = document.querySelector(`meta[name="${item.name}"]`) || document.querySelector(`meta[property="${item.name}"]`)
        let append = false
        if (!el) {
          append = true
          el = document.createElement('meta')
          el.setAttribute(item.type, item.name)
        }
        el.setAttribute('content', item.content)
        if (append) {
          document.querySelector('head').appendChild(el)
        }
      })
      window.prerenderReady = true
      return { title, descrip, img, meta }
    }
  },
  mutations: {
    SIGN_IN (state, address) {
      state.address = address.toLowerCase()
    },
    SIGN_OUT (state) {
      state.address = null
    },
    SET_NETWORK (state, id) {
      state.networkId = id
    },
    SAVE_WORK (state, work) {
      const i = state.works.findIndex(svd => svd.id === work.id)
      // remove existing ?
      if (i > -1) state.works.splice(i, 1)
      // push so app updates
      state.works.push(work)
    },
    SAVE_TOKEN (state, token) {
      state.tokens.push(token) // [tokenId, ownerAddr]
    },
    SAVE_METADATA (state, metadata) {
      state.metadatas.push(metadata)
    },
    SET_CONTRACTS (state, { web3, networkId }) {
      // if (!web3) return new Error('web3 not defined')
      // nft
      state.nftContract = new web3.eth.Contract(
        DotComSeance.abi,
        DotComSeance.networks[networkId].address
      )
      console.log('nft addr', DotComSeance.networks[networkId].address)
      // controller
      state.controllerContract = new web3.eth.Contract(
        DotComSeanceController.abi,
        DotComSeanceController.networks[networkId].address
      )
      console.log('controller addr', DotComSeanceController.networks[networkId].address)
      // registrar
      state.registrarContract = new web3.eth.Contract(
        SubdomainRegistrar.abi,
        SubdomainRegistrar.networks[networkId].address
      )
      console.log('registrar addr', SubdomainRegistrar.networks[networkId].address)
    },
    SAVE_NAME (state, { address, name }) {
      const names = { ...state.names }
      names[address] = name
      state.names = names
    },
    IS_LISTENING (state) {
      state.isListening = true
    },
    SET_LAST_MINT_EVENT (state, event) {
      state.lastMintEvent = event
    }
  },
  actions: {
    /* setup web3, contracts */
    async init ({ state, commit, dispatch }) {
      // de-dupe
      if (initializing) {
        return initializing
      }

      // handler
      const setup = async () => {
        try {
          // auto-connect?
          if (web3Modal.cachedProvider) {
            await dispatch('connect')
          }

          // setup web3
          if (!web3) {
            if (provider) {
              // wallet provider...
              web3 = new Web3(provider)
            } else {
              // fallback to infura
              const network = networks[fallbackNetworkId]
              web3 = new Web3(new Web3.providers.WebsocketProvider(network.infura))
            }
          }

          // setup contracts
          const networkId = state.networkId || await web3.eth.net.getId() || fallbackNetworkId // || networks.mainnet.id
          console.log('network:', networkId)
          commit('SET_NETWORK', networkId)
          commit('SET_CONTRACTS', { web3, networkId })

          // listen to provider events
          dispatch('listenToProvider')

          initializing = false
          return true
        } catch (e) {
          console.error('@init', e)
          initializing = false
          throw e
        }
      }

      // create a promise for the handler
      initializing = new Promise((resolve, reject) => {
        setup()
          .then(resolve)
          .catch(reject)
      })

      return initializing
    },

    getWeb3 () {
      // TODO better handler for this
      return web3
    },

    /* connect wallet */
    async connect ({ commit, dispatch }) {
      try {
        // connect and update provider, web3
        provider = await web3Modal.connect()
        web3 = new Web3(provider)
        // save account
        const accounts = await web3.eth.getAccounts()
        const address = accounts[0]
        const networkId = await web3.eth.net.getId()
        // const chainId = await web3.eth.chainId(); // not a function??
        commit('SIGN_IN', address)
        commit('SET_NETWORK', networkId)
        commit('SET_CONTRACTS', { web3, networkId })
      } catch (e) {
        console.error('@connect', e)
        dispatch('disconnect')
        throw e
      }
    },

    /* disconnect wallet */
    disconnect ({ commit }) {
      // clear so they can re-select from scratch
      web3Modal.clearCachedProvider()
      // manually remove WC so can choose new account
      localStorage.removeItem('walletconnect')
      // provider.off('accountsChanged')
      // provider.off('disconnect')
      commit('SIGN_OUT')
    },

    /* wallet events */
    listenToProvider ({ commit, dispatch }) {
      if (!provider?.on) return

      // account changed (or disconnected)
      provider.on('accountsChanged', accounts => {
        console.log('accountsChanged', accounts)
        if (!accounts.length) {
          return dispatch('disconnect')
        }
        commit('SIGN_IN', accounts[0])
      })

      // changed network
      provider.on('chainChanged', chainId => {
        console.log('network changed', chainId)
        // reload page so data is correct...
        window.location.reload()
      })

      // random disconnection? (doesn't fire on account disconnect)
      provider.on('disconnect', error => {
        console.error('disconnected?', error)
        dispatch('disconnect')
      })
    },

    async getContractPaused ({ state, commit, dispatch }) {
      try {
        if (!state.controllerContract) await dispatch('init')
        return state.controllerContract.methods.paused().call()
      } catch (e) {
        console.error('getContractPaused', e)
      }
    },

    async mintGuile ({ state, dispatch, rootGetters }, companyId) {
      try {
        const workId = 0 // all guiles are first work set (ID: 0)
        const printId = companyId

        // check if contract is paused
        const contractPaused = await dispatch('getContractPaused')
        if (contractPaused) {
          throw new Error('!! All minting is paused. Please wait for release.')
        }

        // get work, then validate
        const work = await dispatch('getWork', { id: 0, flush: true })

        // !! unavailable
        if (!work || !work.exists) throw new Error(`!! Edition ${workId} doesn't exist`)
        // !! paused
        if (work.paused) throw new Error(`!! Edition ${workId} is locked. Please wait for release or try again shortly.`)

        // wallet connected ?
        if (!state.address) {
          await dispatch('connect')
        }

        // !! not enough ETH
        const bn = mixed => new web3.utils.BN(mixed)
        const balance = await rootGetters.userBalance()
        const insufficientFunds = bn(balance).lt(bn(work.price))
        if (insufficientFunds) throw new Error(`!! Insufficient funds in your wallet\n${state.address}`)

        // buy
        return state.controllerContract.methods
          .buyByID(state.address, workId, printId)
          .send({ from: state.address, value: work.price })
        // refresh work data for app
        // dispatch('getWork', { id: workId, flush: true })
      } catch (e) {
        console.error('@buyByID:', e)
        // track
        // exception({ description: `@buyByID: ${e.message}`, fatal: false })
        // TODO - more elegant UX error ?
        if (e.message?.includes('!! ')) {
          alert(e.message.replace('!! ', ''))
        }
        throw e
      }
    },

    /* buy machine artwork by companey id */
    async mintMachine ({ state, dispatch }, companyId) {
      try {
        const contractPaused = await dispatch('getContractPaused')
        if (contractPaused) {
          throw new Error('!! All minting is paused. Please wait for unlock or try again shortly.')
        }

        const work = await dispatch('getWork', { id: companyId, flush: true })
        // !! unavailable
        if (!work || !work.exists) throw new Error(`!! Company ${companyId} doesn't exist`)
        if (Number(work.printed) >= Number(work.editions)) throw new Error(`!! Work ${companyId} is sold out`)
        if (work.paused) throw new Error(`!! Work ${companyId} is locked. Please wait for release or try again shortly.`)
        // wallet connected ?
        if (!state.address) await dispatch('connect')

        // buy
        return state.controllerContract.methods
          .buy(state.address, companyId)
          .send({ from: state.address, value: work.price })
        // refresh work data for app
        // dispatch('getWork', { id: workId, flush: true })
      } catch (e) {
        console.error('@buy:', e)
        // track
        // exception({ description: `@buy: ${e.message}`, fatal: false })
        // TODO - more elegant UX error ?
        if (e.message?.includes('!! ')) {
          alert(e.message.replace('!! ', ''))
        }
        throw e
      }
    },

    /* read artwork */
    async getWork ({ state, commit, dispatch }, { id, flush }) {
      try {
        // saved ?
        let work = state.works.find(work => work.id === id)
        if (work && !flush) {
          return work
        }

        // get new data...
        if (!state.controllerContract) {
          await dispatch('init')
        }

        work = await state.controllerContract.methods._works(id).call()
        work = { id, ...work } // add id
        commit('SAVE_WORK', work)

        return work
      } catch (e) {
        console.error('@getWork', e)
        return null
      }
    },

    /* get metadata of work (if released) */
    async getMetadata ({ state, commit }, { token, work, isViewer = false }) {
      try {
        token = token || Number(work) * 1000000
        work = work || Math.floor(Number(token) / 1000000)

        // !! is not a number
        if (isNaN(token)) throw new Error(`Token ID is not a number: ${token}`)

        // return saved ?
        const saved = state.metadatas.find(metadata => metadata._token === token)
        const now = new Date().getTime()
        const release = saved && saved.release && new Date(saved.release).getTime()
        const hasSinceReleased = release && release > 0 && now >= release
        if (saved && !hasSinceReleased) {
          return saved
        }
        // fetch new
        // query parameters
        let params = []
        if (state.networkId) params.push(`network=${state.networkId}`)
        if (isViewer) params.push('viewer=1')
        params = params.length ? '?' + params.join('&') : ''
        const url = `/.netlify/functions/metadata/${token}${params}`
        // go!
        let metadata = await fetch(url).then(resp => resp.json())
        // process
        if (metadata && metadata.name) {
          metadata = { _work: work, _token: token, ...metadata }
          commit('SAVE_METADATA', metadata)
          return metadata
        }
        return null
      } catch (e) {
        console.error(e)
      }
    },

    /* get owner by token id */
    async getNFTOwner ({ state, commit, dispatch }, tokenId) {
      try {
        // saved ?
        const token = state.tokens.find(token => token[0] === tokenId) || []
        let owner = token && token[1]
        if (owner) return owner
        // get new data...
        if (!state.nftContract) await dispatch('init')
        owner = await state.nftContract.methods.ownerOf(tokenId).call()
        if (owner) {
          owner = owner.toLowerCase()
          commit('SAVE_TOKEN', [tokenId, owner])
        }
        return owner
      } catch (e) {
        // seems to error if token doesn't exist...
        console.warn("get owner error / token doesn't exist?", tokenId, e)
        return null
      }
    },

    // ENS registration
    async registerENSSubdomain ({ state, dispatch }, { name, tokenId }) {
      return state.registrarContract.methods
        .registerSubdomain(name, tokenId)
        .send({ from: state.address })
    },

    async getSubdomainEvents ({ state, dispatch }) {
      if (!state.registrarContract) await dispatch('init')
      return state.registrarContract.getPastEvents('NewSubdomain', { fromBlock: 0 }) //, { fromBlock: 0 })
    },

    getAddressName ({ state, commit, dispatch }, address) {
      if (!address) return console.warn('address missing')
      address = address.toLowerCase()
      const reqId = `getName=${address}`

      // saved?
      if (state.names[address] !== undefined) return state.names[address]

      // request exists?
      let request = requests[reqId]
      if (request) {
        // console.log('waiting on request already sent for ', address)
        return request
      }

      // handler
      const fetchNameFromOpenSea = async (address) => {
        try {
          // get!
          const prefix = state.networkId === 4 ? 'testnets-' : ''
          let resp = await fetch(`https://${prefix}api.opensea.io/api/v1/account/${address}`)

          // throttled ?
          if (resp.status === 429) {
            // wait and try again >:)
            return new Promise((resolve, reject) => setTimeout(() => {
              resolve(dispatch('getAddressName', address))
            }, 1001))
          }

          resp = await resp.json()
          const name = resp.data?.user?.username || null

          commit('SAVE_NAME', { address, name })
          delete requests[reqId]

          return name
        } catch (e) {
          console.error('@getAddressOpenSeaName', e)
          delete requests[reqId]
          throw e
        }
      }

      // setup request
      request = new Promise((resolve, reject) => {
        fetchNameFromOpenSea(address).then(resolve).catch(reject)
      })

      // save request for de-deduping
      requests[reqId] = request

      return request
    },

    async updateOpenSeaToken ({ state, getters, dispatch }, tokenId) {
      try {
        const prefix = state.networkId === 4 ? 'testnets-' : ''
        const resp = await fetch(`https://${prefix}api.opensea.io/api/v1/asset/${getters.contractAddr}/${tokenId}/?force_update=true`)

        // throttled ?
        if (resp.status === 429) {
          // wait and try again >:)
          return new Promise((resolve, reject) => setTimeout(() => {
            resolve(dispatch('updateOpenSeaToken', tokenId))
          }, 1001))
        }
      } catch (e) {
        console.error(e)
      }
    },

    async listenForMints ({ state, commit, dispatch }) {
      try {
        if (!state.controllerContract) await dispatch('init')
        if (state.isListening) return
        state.controllerContract.events.editionBought()
          .on('data', event => commit('SET_LAST_MINT_EVENT', event))
          .on('error', e => console.error('error listening to mints', e))
        console.log('listening for mints...')
        commit('IS_LISTENING')
      } catch (e) {
        console.error(e)
      }
    }
  }
})
