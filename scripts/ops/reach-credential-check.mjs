#!/usr/bin/env node
// Read-only isolation check for the GoLo Reach Collaborator token (golo#791, golowebsite#124).
//
//   REACH_PROFILE_UUID=… REACH_OTHER_PROFILE_UUID=… node scripts/ops/reach-credential-check.mjs
//
// Interpret Reach results only alongside a control: the owner's own access to the same profile at
// the same time (Hostinger Connector, contacts list). If the control also fails (e.g. Reach:9999 5xx),
// the Reach rows are outage-contaminated and prove nothing.
//
// The token is read from the macOS Keychain (service "golo-reach-collab-token") inside this
// process and only ever placed in the Authorization header. Nothing prints the token, a header,
// a contact's address or a response body: each line is the endpoint label, the HTTP status and a
// count or an error code.
//
// Verdicts:
//   ACCESSIBLE         2xx with data (expected only for the golo.golf Reach profile)
//   REFUSED            401 or 403 (isolation established for that endpoint)
//   AMBIGUOUS-EMPTY    2xx with an empty list (does NOT establish isolation)
//   AMBIGUOUS-<code>   any other status, e.g. 404 or 5xx (does NOT establish isolation)
import { execFileSync } from 'node:child_process'

// Profile ids come from the environment (never hard-coded in this public repo):
//   REACH_PROFILE_UUID        the golo.golf profile the token must reach
//   REACH_OTHER_PROFILE_UUID  another Reach profile on the same owner account that it must NOT reach
const GOLO = process.env.REACH_PROFILE_UUID ?? ''
const OTHER_REACH = process.env.REACH_OTHER_PROFILE_UUID ?? ''
if (!GOLO || !OTHER_REACH) { console.log('Set REACH_PROFILE_UUID and REACH_OTHER_PROFILE_UUID. Nothing was called.'); process.exit(2) }
const BASE = 'https://developers.hostinger.com'

let token
try {
  token = execFileSync('security', ['find-generic-password', '-s', 'golo-reach-collab-token', '-w'], { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
} catch {
  console.log('No Keychain item "golo-reach-collab-token". Nothing was called.')
  process.exit(2)
}
if (!token) { console.log('The Keychain item is empty. Nothing was called.'); process.exit(2) }

const checks = [
  { label: 'Reach golo.golf contacts (must work)', path: `/api/reach/v1/profiles/${GOLO}/contacts?per_page=1`, expect: 'ACCESSIBLE' },
  { label: 'Reach profiles list', path: '/api/reach/v1/profiles', expect: 'ONLY_GOLO' },
  { label: 'Reach other profile contacts', path: `/api/reach/v1/profiles/${OTHER_REACH}/contacts?per_page=1`, expect: 'REFUSED' },
  { label: 'Domains portfolio', path: '/api/domains/v1/portfolio', expect: 'REFUSED' },
  { label: 'DNS zone golo.golf', path: '/api/dns/v1/zones/golo.golf', expect: 'REFUSED' },
  { label: 'Hosting websites', path: '/api/hosting/v1/websites', expect: 'REFUSED' },
  { label: 'Billing subscriptions', path: '/api/billing/v1/subscriptions', expect: 'REFUSED' },
  { label: 'VPS virtual machines', path: '/api/vps/v1/virtual-machines', expect: 'REFUSED' },
]

const count = (body) => {
  if (Array.isArray(body)) return body.length
  if (Array.isArray(body?.data)) return body.data.length
  return null
}

let failures = 0
for (const c of checks) {
  let status, body
  try {
    const res = await fetch(BASE + c.path, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } })
    status = res.status
    try { body = await res.json() } catch { body = null }
  } catch (err) {
    console.log(`${c.label}: request failed (${err?.cause?.code ?? err?.name ?? 'error'}) -> AMBIGUOUS`)
    failures++
    continue
  }
  let verdict, detail = ''
  if (status === 401 || status === 403) {
    verdict = 'REFUSED'
    detail = body?.error ?? body?.message ?? ''
    if (typeof detail !== 'string') detail = ''
    detail = detail.replace(/[^\w .:,'()-]/g, '').slice(0, 80)
  } else if (status >= 200 && status < 300) {
    const n = count(body) ?? (body?.meta?.total ?? null)
    if (c.expect === 'ONLY_GOLO') {
      const uuids = JSON.stringify(body ?? '').match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g) ?? []
      const others = [...new Set(uuids)].filter((u) => u !== GOLO)
      verdict = uuids.includes(GOLO) && !JSON.stringify(body).includes(OTHER_REACH) ? 'ACCESSIBLE' : 'AMBIGUOUS'
      detail = `golo profile listed: ${uuids.includes(GOLO)}; other Reach profile listed: ${JSON.stringify(body).includes(OTHER_REACH)}; other uuids: ${others.length}`
    } else {
      // The golo.golf list may legitimately be empty; a 2xx with pagination meta still proves access.
      verdict = n === 0 && !(c.expect === 'ACCESSIBLE' && body?.meta) ? 'AMBIGUOUS-EMPTY' : 'ACCESSIBLE'
      detail = n === null ? 'items: unknown shape' : `items: ${n}${body?.meta?.total != null ? `, total: ${body.meta.total}` : ''}`
    }
  } else {
    verdict = `AMBIGUOUS-${status}`
  }
  const pass = c.expect === 'ONLY_GOLO' ? verdict === 'ACCESSIBLE' : verdict === c.expect
  if (!pass) failures++
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${c.label}: HTTP ${status} -> ${verdict}${detail ? ` (${detail})` : ''}; expected ${c.expect}`)
}
token = undefined
console.log(failures === 0 ? 'Isolation established for every endpoint checked.' : `Isolation NOT established: ${failures} check(s) failed or were ambiguous.`)
process.exit(failures === 0 ? 0 : 1)
