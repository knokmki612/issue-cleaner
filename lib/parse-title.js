const parse = require('date-fns/parse')

module.exports = class ParseTitle {
  constructor (title) {
    this.title = title.split(':').map(string => {
      return string.replace(/^ +/, '').replace(/ +$/, '')
    })

    const [base, rawPlace, rawDate] = this.title
    Object.assign(this, { base, rawPlace, rawDate })
  }

  get place () {
    return this.rawPlace.toLowerCase()
  }

  get date () {
    return parse(this.rawDate)
  }

  get isWorkshop () {
    return /oss gate workshop/.test(this.base.toLowerCase())
  }

  get isEventIssue () {
    return this.title.length >= 3 &&
      /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(this.rawDate) &&
      /oss gate (workshop|meetup)/.test(this.base.toLowerCase())
  }
}
