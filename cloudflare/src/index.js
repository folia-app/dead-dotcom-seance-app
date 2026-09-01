/**
 * dotcom-seance.folia.app as a Worker.
 *
 *   /v1/metadata/*  -> metadata      (netlify.toml)
 *   /*              -> /index.html   (netlify.toml, status 200)
 *
 * The app also calls /.netlify/functions/metadata/... and
 * /.netlify/functions/machines/... directly from the browser -- see
 * src/store/index.js and src/components/MachineNFTs.vue -- so those paths are
 * served here too. Without them the SPA catch-all would answer a fetch() for
 * JSON with index.html, and the failure would show up as a parse error far
 * from its cause.
 */
import { handler as metadata } from '../../src/lambda/metadata'
import { handler as machines } from '../../src/lambda/machines'
import { runNetlifyFunction } from './netlify'

const FUNCTIONS = { metadata, machines }

export default {
  async fetch (request, env) {
    const url = new URL(request.url)

    if (url.pathname.startsWith('/v1/metadata/')) {
      return runNetlifyFunction(metadata, request, { path: url.pathname })
    }

    if (url.pathname.startsWith('/.netlify/functions/')) {
      const rest = url.pathname.slice('/.netlify/functions/'.length)
      const fn = FUNCTIONS[rest.split('/')[0]]
      if (!fn) return new Response('Not Found', { status: 404 })
      return runNetlifyFunction(fn, request, { path: url.pathname })
    }

    let res = await asset(env, request, url.pathname)
    if (res.status === 404 && url.pathname.endsWith('/')) {
      const idx = await asset(env, request, url.pathname + 'index.html')
      if (idx.status !== 404) res = idx
    }
    if (res.status === 404) {
      const index = await asset(env, request, '/index.html')
      if (index.status !== 404) res = new Response(index.body, { status: 200, headers: index.headers })
    }
    return res
  }
}

function asset (env, request, pathname) {
  const u = new URL(request.url)
  u.pathname = pathname
  u.search = ''
  return env.ASSETS.fetch(new Request(u, { method: request.method, headers: request.headers }))
}
