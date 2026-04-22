import type { AuthState, AuthUser } from '../store/slices/authSlice'

/**
 * Mimics what many OIDC + PKCE clients persist after a successful
 * `authorization_code` + `code_verifier` token exchange: OAuth2 response
 * fields plus a parsed profile, stored as JSON in `localStorage`.
 */
export const FAKE_OIDC_TOKEN_STORAGE_KEY =
  'oidc.user:https://auth.example.com:react-microfrend'

export type FakePkceTokenSet = {
  access_token: string
  token_type: 'Bearer'
  expires_in: number
  /** Epoch seconds, common derived field in SPA OIDC clients */
  expires_at: number
  refresh_token: string
  scope: string
  id_token: string
  session_state: string
  /** Often derived from id_token (e.g. oidc-client). */
  profile: {
    sub: string
    email: string
    name: string
    preferred_username: string
  }
}

const ISSUER = 'https://auth.example.com/realms/react-microfrend'
const CLIENT_ID = 'react-microfrend'
const SCOPE = 'openid profile email api.products.read'

function base64UrlJson(obj: object): string {
  const s = JSON.stringify(obj)
  const b64 = btoa(s)
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/**
 * Not a real JWT; three segments shaped like A256 Crypto tokens for demos.
 * Third segment is a placeholder (real PKCE responses use a server signature).
 */
function makeFakeJwt(
  role: 'access' | 'id',
  claims: Record<string, string | number | boolean>,
): string {
  const header = {
    alg: 'RS256' as const,
    typ: 'JWT' as const,
    kid: 'demo-fake-pkce-kid-1',
  }
  return [base64UrlJson(header), base64UrlJson(claims), `fake-sig-${role}`].join(
    '.',
  )
}

function stableSub(email: string): string {
  return `urn:demo:${[...email].reduce((a, c) => a + c.charCodeAt(0), 0)}`
}

function randomOpaque(prefix: string): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  const bin = String.fromCharCode(...bytes)
  return `${prefix}${btoa(bin).replace(/\+/g, '-').replace(/\//g, '_')}`
}

const SECONDS = (n: number) => n
const HOUR = SECONDS(3600)

/**
 * Produces a token set similar to an OIDC token endpoint with PKCE after login.
 */
export function createFakePkceTokenSet(input: {
  email: string
  displayName: string
}): FakePkceTokenSet {
  const nowSec = Math.floor(Date.now() / 1000)
  const sub = stableSub(input.email)
  const expires_in = HOUR
  const exp = nowSec + expires_in

  const accessPayload = {
    iss: ISSUER,
    sub,
    aud: 'api://products',
    azp: CLIENT_ID,
    iat: nowSec,
    exp,
    scope: SCOPE,
    client_id: CLIENT_ID,
  }

  const idPayload = {
    iss: ISSUER,
    sub,
    aud: CLIENT_ID,
    iat: nowSec,
    exp,
    email: input.email,
    name: input.displayName,
    preferred_username: input.email,
    email_verified: true,
  }

  return {
    access_token: makeFakeJwt('access', accessPayload),
    token_type: 'Bearer',
    expires_in,
    expires_at: exp,
    refresh_token: randomOpaque('fake-rt_'),
    scope: SCOPE,
    id_token: makeFakeJwt('id', idPayload),
    session_state: randomOpaque('sess_'),
    profile: {
      sub,
      email: input.email,
      name: input.displayName,
      preferred_username: input.email,
    },
  }
}

function parseTokenSet(raw: string | null): FakePkceTokenSet | null {
  if (!raw) return null
  try {
    const v = JSON.parse(raw) as FakePkceTokenSet
    if (
      typeof v.access_token !== 'string' ||
      typeof v.expires_at !== 'number' ||
      v.profile == null
    ) {
      return null
    }
    return v
  } catch {
    return null
  }
}

export function persistFakePkceTokenSet(data: {
  user: AuthUser
}): FakePkceTokenSet {
  const set = createFakePkceTokenSet(data.user)
  localStorage.setItem(FAKE_OIDC_TOKEN_STORAGE_KEY, JSON.stringify(set))
  return set
}

export function clearFakePkceTokenSet(): void {
  localStorage.removeItem(FAKE_OIDC_TOKEN_STORAGE_KEY)
}

/**
 * @returns `null` if missing or expired; stale storage is cleared.
 */
export function loadFakePkceTokenSet(): FakePkceTokenSet | null {
  const set = parseTokenSet(localStorage.getItem(FAKE_OIDC_TOKEN_STORAGE_KEY))
  if (!set) return null
  const nowSec = Math.floor(Date.now() / 1000)
  if (set.expires_at <= nowSec) {
    clearFakePkceTokenSet()
    return null
  }
  return set
}

/**
 * `Authorization` value for API calls, if a valid token set exists.
 */
export function getStoredAccessTokenForApi(): string | null {
  const set = loadFakePkceTokenSet()
  if (!set) return null
  return set.access_token
}

export function getStoredAuthHeaderValue(): string | null {
  const token = getStoredAccessTokenForApi()
  return token == null ? null : `Bearer ${token}`
}

export function rehydrateAuthStateFromStorage(): AuthState | undefined {
  const set = loadFakePkceTokenSet()
  if (!set) return undefined
  return {
    user: {
      email: set.profile.email,
      displayName: set.profile.name,
    },
  }
}
