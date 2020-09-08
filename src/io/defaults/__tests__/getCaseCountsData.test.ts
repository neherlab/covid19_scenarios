import { getCaseCountsData } from '../getCaseCountsData'

describe('getSortedNonEmptyCaseCounts', () => {
  it('sorts by ascending time', () => {
    const got = getCaseCountsData('United States of America').data
    got.forEach((entry, index) => {
      if (index > 0) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(entry.time.getTime()).toBeGreaterThan(got[index - 1].time.getTime())
      }
    })
  })

  it('returns no empty entries', () => {
    const got = getCaseCountsData('United States of America').data
    got.forEach((entry) => {
      const notEmpty = entry.cases || entry.deaths || entry.icu || entry.hospitalized
      expect(notEmpty).toBeTruthy()
    })
  })
})
