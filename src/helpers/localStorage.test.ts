import LocalStorage, { LOCAL_STORAGE_KEYS } from './localStorage'

const keys = <T>(o: T) => Object.keys(o) as Array<keyof T>

describe('localStorage', () => {
  beforeEach(() => {
    keys(LOCAL_STORAGE_KEYS).forEach((key) => {
      LocalStorage.remove(LOCAL_STORAGE_KEYS[key])
    })
  })

  it('initially returns null', () => {
    keys(LOCAL_STORAGE_KEYS).map((key) => {
      expect(LocalStorage.get(LOCAL_STORAGE_KEYS[key])).toBeNull()
    })
  })

  it('can set and get', () => {
    LocalStorage.set('autorun-simulation', false)
    LocalStorage.set('suppress-disclaimer', {
      version: 3333.22222,
      suppressShowAgain: true,
    })
    LocalStorage.set('skip-landing-page', 'false')

    expect(LocalStorage.get('autorun-simulation')).toEqual(false)
    expect(LocalStorage.get('suppress-disclaimer')).toEqual({
      version: 3333.22222,
      suppressShowAgain: true,
    })
    expect(LocalStorage.get('skip-landing-page')).toEqual('false')
  })

  it('will return null if an invalid value is contained within localStorage', () => {
    const untyped: any = LocalStorage
    untyped.set('autorun-simulation', 'bad')
    untyped.set('suppress-disclaimer', {
      version: '',
      suppressShowAgain: true,
    })

    expect(LocalStorage.get('autorun-simulation')).toBeNull()
    expect(LocalStorage.get('suppress-disclaimer')).toBeNull()
  })
})
