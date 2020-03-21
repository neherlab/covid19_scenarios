import { infectionRate } from '../model'

describe('model', () => {
  describe('infectionRate', () => {
    const dec2020 = new Date('2020-12-01').getTime()

    it('baseline', () => {
      expect(infectionRate(dec2020, 0.9, 3, 0.2)).toEqual(0.7768945041075702)
    })

    it('accounts for time correctly', () => {
      const jul2020 = new Date('2020-07-01').getTime()
      const feb2021 = new Date('2021-02-01').getTime()

      expect(infectionRate(jul2020, 0.4, 3, 0.2)).toEqual(0.4194279777676749)
      expect(infectionRate(feb2021, 1.5, 3, 0.2)).toEqual(1.5927050983124844)
    })

    it('accounts for avgInfectionRate correctly', () => {
      expect(infectionRate(dec2020, 0.4, 3, 0.2)).toEqual(0.3452864462700312)
      expect(infectionRate(dec2020, 1.5, 3, 0.2)).toEqual(1.294824173512617)
    })

    it('accounts for peakMonth correctly', () => {
      expect(infectionRate(dec2020, 0.9, 2, 0.2)).toEqual(0.8577915498773262)
      expect(infectionRate(dec2020, 0.9, 7, 0.2)).toEqual(0.842905568053961)
    })

    it('accounts for seasonalForcing correctly', () => {
      expect(infectionRate(dec2020, 0.9, 3, 0.1)).toEqual(0.8384472520537851)
      expect(infectionRate(dec2020, 0.9, 3, 0.4)).toEqual(0.6537890082151402)
    })
  })
})
