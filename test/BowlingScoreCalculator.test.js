import { describe, it } from 'node:test'
import assert from 'node:assert'

import BowlingScoreCalculator from '../src/BowlingScoreCalculator.js'

describe('BowlingScoreCalculator', () => {

  describe('calculate()', () => {
    const testCases = [
      { input:  "XXXXXXXXXXXX",       expectedValue: 300 },
      { input:  "165/251/X2/71XX1/7", expectedValue: 149 },
    ]

    testCases.forEach(({ expectedValue, input }) => {
      it(`should return the correct score for "${input}"`, () => {
        const bowlingScoreCalculator = new BowlingScoreCalculator()
        const score = bowlingScoreCalculator.calculate(input)
  
        assert(score, expectedValue)
      })
    })

  })
})