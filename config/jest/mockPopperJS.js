// mock popper.js (reactstrap dependency via react-popper)
// see: https://github.com/popperjs/popper-core/issues/478#issuecomment-341494703

jest.mock('popper.js', () => {
  return class {
    constructor() {
      return {
        destroy: () => null,
        scheduleUpdate: () => null,
      }
    }
  }
})
