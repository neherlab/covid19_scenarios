if (typeof Promise === 'undefined') {
  global.Promise = require('core-js/es/promise')
}

export default Promise.all(
  [
    typeof Object.assign === 'undefined' &&
      import(/* webpackMode: "lazy" */ /* webpackChunkName: "polyfills/object-assign" */ 'core-js/es/object/assign'), // prettier-ignore

    typeof Object.defineProperty === 'undefined' &&
      import(/* webpackMode: "lazy" */ /* webpackChunkName: "polyfills/object-define-property" */ 'core-js/es/object/define-property'), // prettier-ignore

    typeof Object.defineProperties === 'undefined' &&
      import(/* webpackMode: "lazy" */ /* webpackChunkName: "polyfills/object-define-properties" */ 'core-js/es/object/define-properties'), // prettier-ignore

    typeof String.prototype.startsWith === 'undefined' &&
      import(/* webpackMode: "lazy" */ /* webpackChunkName: "polyfills/string-starts-with" */ 'core-js/es/string/starts-with'), // prettier-ignore

    (typeof Set === 'undefined' || typeof Map === 'undefined') &&
      import(/* webpackMode: "lazy" */ /* webpackChunkName: "polyfills/map" */ 'core-js/es/map'), // prettier-ignore

    typeof Set === 'undefined' &&
      import(/* webpackMode: "lazy" */ /* webpackChunkName: "polyfills/set" */ 'core-js/es/set'), // prettier-ignore

    (typeof window.requestAnimationFrame === 'undefined' || typeof window.cancelAnimationFrame === 'undefined') &&
      import(/* webpackMode: "lazy" */ /* webpackChunkName: "polyfills/raf" */ 'raf').then(raf => raf.polyfill(global)), // prettier-ignore
  ].filter(Boolean),
)
  .then(() => require('./index'))
  .catch(error => console.error(error))
