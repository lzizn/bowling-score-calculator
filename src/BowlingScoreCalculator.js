
export default class BowlingScoreCalculator {
  TOTAL_AMOUNT_OF_PINS = 10
  AMOUNT_OF_ROUNDS = 10

  score = 0
  round = 1

  /**
   * A string where each character is a throw. Must contain all 10 rounds.
   * Example: "165/251/X2/71XX1/7"
   * 
   * @param {string} throws 
   * @returns {number} score
   */
  calculate(throws) {
    for (let i = 0; i < throws.length; i++) {

      const prevThrow      = throws[i-1]
      const currThrow      = throws[i]
      const nextThrow      = throws[i+1]
      const afterNextThrow = throws[i+1+1]

      if (this.#isSpare(currThrow)) {
        this.round += 1;

        const knockedPins = this.TOTAL_AMOUNT_OF_PINS - Number(prevThrow)
        this.#incrementScore(knockedPins)
        this.#addSpareBonusPoints(nextThrow)
      }
      else if (this.#isStrike(currThrow)) {
        if (this.round > this.AMOUNT_OF_ROUNDS) {
          continue;
        }

        this.#incrementScore(this.TOTAL_AMOUNT_OF_PINS)
        this.#addStrikeBonusPoints(nextThrow, afterNextThrow)

        this.round += 1;
      }
      else {
        this.#handleFewKnockedPins(
          prevThrow,
          currThrow,
          nextThrow,
        );
      }
    }

    return this.score
  } 
  
  /**
   * @param {string} _throw 
   * @returns {boolean}
   */
  #isSpare(_throw) {
    return _throw === '/'
  }

  /**
   * @param   {string} _throw 
   * @returns {boolean}
   */
  #isStrike(_throw) {
    return String(_throw).toLowerCase() === 'x'
  }

  /**
   * @param {string} prevThrow
   * @param {string} currThrow
   * @param {string} nextThrow
  */
  #handleFewKnockedPins(prevThrow, currThrow, nextThrow) {
    this.#incrementScore(currThrow)

    const isFirstRound = this.round === 1

    if (isFirstRound && prevThrow === undefined) {
      return
    }

    const prevThrowIsNUMBER = prevThrow !== undefined &&
      !this.#isSpare(prevThrow) &&
      !this.#isStrike(prevThrow)

    const nextThrowIsNUMBER = nextThrow !== undefined &&
      !this.#isSpare(nextThrow) &&
      !this.#isStrike(nextThrow)

    if (prevThrowIsNUMBER && nextThrowIsNUMBER) {
      this.round += 1;
    }
  }


  /**
   * @param {string | number} knockedPinsAmount
  */
  #incrementScore(knockedPinsAmount) {
    const _knockedPinsAmount = Number(knockedPinsAmount)

    if (isNaN(_knockedPinsAmount)) {
      throw new Error('#incrementScore: knockedPinsAmount must be a valid number')
    }

    this.score += _knockedPinsAmount
  }

  /**
   * @param {string}  prevThrow 
   * @param {string}  nextThrow 
   */
  #addSpareBonusPoints(nextThrow) {
    if (this.round === this.AMOUNT_OF_ROUNDS) {
      return
    }

    if (this.#isStrike(nextThrow)) {
      this.#incrementScore(this.TOTAL_AMOUNT_OF_PINS)
    }
    else {
      this.#incrementScore(nextThrow)
    }
  }

  /**
   * @param {string}  nextThrow 
   * @param {string}  afterNextThrow 
   */
  #addStrikeBonusPoints(nextThrow, afterNextThrow) {
      // Handling NEXT ROUND of a strike
      if (nextThrow === undefined) {
        return
      }

      const isStrikeNextThrow = this.#isStrike(nextThrow)
      if (isStrikeNextThrow) {
        this.#incrementScore(this.TOTAL_AMOUNT_OF_PINS)
      }
      else {
        this.#incrementScore(nextThrow)
      }

      // Handling AFTER NEXT ROUND (+2 ROUNDS) of a strike
      if (afterNextThrow === undefined) {
        return
      }

      const isStrikeAfterNextThrow = this.#isStrike(afterNextThrow)
      const isSpareAfterNextThrow = this.#isSpare(afterNextThrow)

      if (isStrikeAfterNextThrow) {
        this.#incrementScore(this.TOTAL_AMOUNT_OF_PINS)
      }
      else if (isSpareAfterNextThrow) {
        const knockedPins = this.TOTAL_AMOUNT_OF_PINS - Number(nextThrow)
        this.#incrementScore(knockedPins)
      }
      else {
        this.#incrementScore(afterNextThrow)
      }
  }
}