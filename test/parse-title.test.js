const ParseTitle = require('../lib/parse-title')
const format = require('date-fns/format')
const addMinutes = require('date-fns/add_minutes')

describe('ParseTitle', () => {
  let parseWorkshopTitle
  let parseMeetupTitle
  let parseOtherTitle

  beforeEach(() => {
    const workshop = 'OSS Gate Workshop         :Tokyo : 2018-12-31: knokmki612 :OSS Gate Issue Cleaner: Work log'
    const meetup = 'OSS Gate Meetup :Tokyo : 2018-06-12'
    const other = 'aaaaaaaa'

    parseWorkshopTitle = new ParseTitle(workshop)
    parseMeetupTitle = new ParseTitle(meetup)
    parseOtherTitle = new ParseTitle(other)
  })

  test('Parsing an Issue Title', async () => {
    const { title } = parseWorkshopTitle

    expect(title).toMatchObject([
      'OSS Gate Workshop',
      'Tokyo',
      '2018-12-31',
      'knokmki612',
      'OSS Gate Issue Cleaner',
      'Work log'
    ])
  })

  test('Parsing an Issue Date', async () => {
    const { rawDate, date } = parseWorkshopTitle

    expect(rawDate ===
      format(addMinutes(date, -date.getTimezoneOffset()), 'YYYY-MM-DD')
    ).toBe(true)
  })

  test('Parsing other title', async () => {
    const { base } = parseOtherTitle

    expect(base).toBe('aaaaaaaa')
  })

  test('Assures that the title follows a format of the workshop event', async () => {
    const { isEventIssue } = parseWorkshopTitle

    expect(isEventIssue).toBe(true)
  })

  test('Assures that the title follows at format of the meetup event', async () => {
    const { isEventIssue } = parseMeetupTitle

    expect(isEventIssue).toBe(true)
  })

  test('Assures that the title doesn\'t follow any format', async () => {
    const { isEventIssue } = parseOtherTitle

    expect(isEventIssue).toBe(false)
  })
})
