const ParseTitle = require('./lib/parse-title')
const Doorkeeper = require('./lib/doorkeeper')
const Mustache = require('mustache')
const fs = require('fs')
const util = require('util')
const isAfter = require('date-fns/is_after')
const startOfToday = require('date-fns/start_of_today')
const createScheduler = require('probot-scheduler')

const generateMessage = async (view) => {
  const readFile = util.promisify(fs.readFile)
  const templatePath = `${__dirname}/template/message.mustache`
  const message = await readFile(templatePath, 'utf8')

  return Mustache.render(message, view)
}

module.exports = app => {
  createScheduler(app, { interval: 12 * 60 * 60 * 1000 })

  app.on('schedule.repository', async context => {
    const { owner, repo } = context.repo()
    const q = `repo:${owner}/${repo} state:open`

    const issues = await context.github.search.issues({ q })

    const doorkeeper = new Doorkeeper()
    const events = await doorkeeper.events(owner).catch(() => [])
    const hasEvents = events.length > 0

    await Promise.all(issues.data.items.map(async result => {
      const { title } = result
      const { date, isWorkshop, isEventIssue } = new ParseTitle(title)

      const message = await generateMessage({ isWorkshop, hasEvents, events })

      if (!isAfter(startOfToday(), date) || !isEventIssue) return

      const issue = (object) => {
        const { number } = result
        return Object.assign({ owner, repo, number }, object)
      }

      await context.github.issues.createComment(issue({ body: message }))
      await context.github.issues.update(issue({ state: 'closed' }))
    }))
  })
}
