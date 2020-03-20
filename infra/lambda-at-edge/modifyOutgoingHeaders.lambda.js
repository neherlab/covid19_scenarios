const FEATURE_POLICY = {
  'ambient-light-sensor': `'none'`,
  'autoplay': `'none'`,
  'battery': `'none'`,
  'display-capture': `'none'`,
  'document-domain': `'none'`,
  'encrypted-media': `'none'`,
  'fullscreen': `'none'`,
  'layout-animations': `'none'`,
  'legacy-image-formats': `'none'`,
  'microphone': `'none'`,
  'midi': `'none'`,
  'oversized-images': `'none'`,
  'picture-in-picture': `'none'`,
  'publickey-credentials': `'none'`,
  'sync-xhr': `'none'`,
  'unoptimized-images': `'none'`,
  'unsized-media': `'none'`,
  'vibrate': `'none'`,
  'vr': `'none'`,
  'xr-spatial-tracking': `'none'`,
  'accelerometer': `'none'`,
  'camera': `'none'`,
  'geolocation': `'none'`,
  'gyroscope': `'none'`,
  'magnetometer': `'none'`,
  'payment': `'none'`,
  'usb': `'none'`,
}

function generateFeaturePolicyHeader(featurePoicyObject) {
  return Object.entries(featurePoicyObject)
    .map(([policy, value]) => `${policy} ${value}`)
    .join('; ')
}

const NEW_HEADERS = {
  'Content-Security-Policy': "default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:",
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

const HEADERS_TO_REMOVE = ['server', 'via']

function filterHeaders(headers) {
  return Object.entries(headers).reduce((result, [key, value]) => {
    if (HEADERS_TO_REMOVE.includes(key.toLowerCase())) {
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
