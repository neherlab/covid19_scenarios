const FEATURE_POLICY = {
  'accelerometer': `'none'`,
  'autoplay': `'none'`,
  'camera': `'none'`,
  'document-domain': `'none'`,
  'encrypted-media': `'none'`,
  'fullscreen': `'none'`,
  'geolocation': `'none'`,
  'gyroscope': `'none'`,
  'magnetometer': `'none'`,
  'microphone': `'none'`,
  'midi': `'none'`,
  'payment': `'none'`,
  'picture-in-picture': `'none'`,
  'screen-wake-lock': `'none'`,
  'sync-xhr': `'none'`,
  'usb': `'none'`,
  'xr-spatial-tracking': `'none'`,
}

function generateFeaturePolicyHeader(featurePoicyObject) {
  return Object.entries(featurePoicyObject)
    .map(([policy, value]) => `${policy} ${value}`)
    .join('; ')
}

const NEW_HEADERS = {
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self' *.gstatic.com; style-src 'self' 'unsafe-inline' *.gstatic.com; img-src 'self' data: *.githubusercontent.com",
  'Referrer-Policy': 'no-referrer',
  'Strict-Transport-Security': 'max-age=15768000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-DNS-Prefetch-Control': 'off',
  'X-Download-Options': 'noopen',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-XSS-Protection': '1; mode=block',
  'Feature-Policy': generateFeaturePolicyHeader(FEATURE_POLICY),
}

function addHeaders(headersObject) {
  return Object.entries(headersObject).reduce(
    (result, [header, value]) => ({
      ...result,
      [header.toLowerCase()]: [{ key: header, value }],
    }),
    {},
  )
}

const HEADERS_TO_REMOVE = new Set(['server', 'via'])

function filterHeaders(headers) {
  return Object.entries(headers).reduce((result, [key, value]) => {
    if (HEADERS_TO_REMOVE.has(key.toLowerCase())) {
      return result
    }

    if (key.toLowerCase().includes('powered-by')) {
      return result
    }

    return { ...result, [key.toLowerCase()]: value }
  }, {})
}

function modifyHeaders(headers) {
  let newHeaders = addHeaders(NEW_HEADERS)

  newHeaders = {
    ...headers,
    ...newHeaders,
  }

  newHeaders = filterHeaders(newHeaders)

  return newHeaders
}

exports.handler = (event, context, callback) => {
  const { response } = event.Records[0].cf
  response.headers = modifyHeaders(response.headers)
  callback(null, response)
}

exports.NEW_HEADERS = NEW_HEADERS
