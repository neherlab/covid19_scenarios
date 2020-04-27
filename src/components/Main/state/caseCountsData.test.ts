import { getSortedNonEmptyCaseCounts } from './caseCountsData'

describe('getSortedNonEmptyCaseCounts', () => {
  it('sorts by ascending time', () => {
    const got = getSortedNonEmptyCaseCounts('United States of America')
    got.forEach((entry, index) => {
      if (index > 0) {
        expect(entry.time.getTime()).toBeGreaterThan(got[index - 1].time.getTime())
      }
    })
  })

  it('returns no empty entries', () => {
    const got = getSortedNonEmptyCaseCounts('United States of America')
    got.forEach((entry) => {
      const notEmpty = entry.cases || entry.deaths || entry.icu || entry.hospitalized
      expect(notEmpty).toBeTruthy()
    })
  })
})
