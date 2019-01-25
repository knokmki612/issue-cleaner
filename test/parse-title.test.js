const ParseTitle = require('../lib/parse-title')
const format = require('date-fns/format')
const isAfter = require('date-fns/is_after')
const parse = require('date-fns/parse')

const workshop = 'OSS Gate Workshop         :Tokyo : 2018-12-31: knokmki612 :OSS Gate Issue Cleaner: Work log'
const meetup = 'OSS Gate Meetup :Tokyo : 2018-06-12'
const other = 'aaaaaaaa'

const parseWorkshopTitle = new ParseTitle(workshop)
const parseMeetupTitle = new ParseTitle(meetup)
const parseOtherTitle = new ParseTitle(other)

describe('ParseTitle', () => {
  test('Parsing an Issue Title', () => {
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

  test('Parsing a place', () => {
    const { place } = parseWorkshopTitle

    expect(place).toBe('tokyo')
  })

  test('Parsing an Issue Date', () => {
    const { rawDate, date } = parseWorkshopTitle

    expect(rawDate === format(date, 'YYYY-MM-DD')).toBe(true)
  })

  test('Parsing other title', () => {
    const { base } = parseOtherTitle

    expect(base).toBe('aaaaaaaa')
  })

  test('Assures that the title follows a format of the workshop event', () => {
    const { isEventIssue } = parseWorkshopTitle

    expect(isEventIssue).toBe(true)
  })

  test('Assures that the title follows at format of the meetup event', () => {
    const { isEventIssue } = parseMeetupTitle

    expect(isEventIssue).toBe(true)
  })

  test('Assures that the title doesn\'t follow any format', () => {
    const { isEventIssue } = parseOtherTitle

    expect(isEventIssue).toBe(false)
  })

  test('Assures that the title doesn\'t follow correct date string', () => {
    const { isEventIssue } = new ParseTitle('OSS Gate Meetup :Tokyo : 2018-06-12&13')

    expect(isEventIssue).toBe(false)
  })

  test('Not process in a same day', () => {
    const { date } = parseWorkshopTitle

    expect(isAfter(parse('2018-12-31'), date)).toBe(false)
  })

  test('Process in after day', () => {
    const { date } = parseWorkshopTitle

    expect(isAfter(parse('2019-01-01'), date)).toBe(true)
  })
})
