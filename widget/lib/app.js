// modules
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const SheetLoader = require('./SheetLoader')
const common = require('./common.js')
const Mailer = require('./Mailer.js')


// data files to immport
const apis = require('./apis.json')
const cpts = require('./cpts.json')
const links = require('./links.json')

// global variables
const PORT = process.env.PORT || 4000

// instanciate modules
const mailer = new Mailer(apis.mailgun)
// updates every 24 hours
const sheetLoader = new SheetLoader('1ae0nTowaSivDqV6CHlac59VW-6jGwPB8qcillwafMiU', apis.sheets, 24)

// main app
var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.disable('x-powered-by')

// run static website
app.use(express.static(common.root + '/public'))

// main landing for widget
app.get('/', (req, res) => {
  app.set('trust proxy', true)
  res.set('clientIP', req.ip)
  res.sendFile(common.root + '/public/widget.html')
})

// send personalized list of links to the client
app.get('/api/links', (req, res) => {
  let pic = req.query.pic || null
  let cpt = cpts.partners.find(partner => partner.pic && (partner.pic === pic)) || null
  if (pic && cpt && cpt.languages.length > 0) {
    let trimmedLinks = JSON.parse(JSON.stringify(links))
    trimmedLinks.languages = trimmedLinks.languages.filter(linkLang => {
      return cpt.languages.some(cptLang => linkLang.name === cptLang)
    })
    trimmedLinks.channels.forEach(channel => {
      channel.languages = channel.languages.filter(linkLang => {
        return cpt.languages.some(cptLang => linkLang.name === cptLang)
      })
    })
    trimmedLinks.channels = trimmedLinks.channels.filter(channel => {
      return channel.languages.length > 0
    })
    if (trimmedLinks.languages.length > 0) {
      res.json(trimmedLinks)
    } else {
      common.log("Warning: their are no links for any of partner " + pic + "'s languages (" + cpt.languages + "). Serving them all languages until sufficient links are added or the CPT is changed.")
      res.json(links)
    }
  } else {
    res.json(links)
  }
})

// logs button presses
app.post('/analytics/', (req, res) => {
  //common.log(req.headers)
  res.end()
})

// for when the user submits a form to email a friend
app.post('/email/share/', (req, res) => {
  let resourceInfo = links.languages
    .find(language => language.name === req.body.language).resources
    .find(resource => resource.id === req.body.resource)
  let resourceName = (resourceInfo.line1 || "Songs for Saplings") + " - " + (resourceInfo.line2 || "Listen Now")
  common.log(req.body.from, path.dirname(__dirname) + '/var/mailingList.txt')
  mailer.share(req.body.from, req.body.to, req.body.message, req.body.link, resourceName)
  res.status(200).end()
})

// for when the user submits a form to recieve a download link
app.post('/email/download/', (req, res) => {
  let email = req.body.email
  let resourceInfo = links.languages
    .find(language => language.name === req.body.language).resources
    .find(resource => resource.id === req.body.resource)
  let resourceName = (resourceInfo.line1 || "Songs for Saplings") + " - " + (resourceInfo.line2 || "Listen Now")
  let downloadLink = links.channels
    .find(channel => channel.name.toLowerCase() === "download").languages
    .find(language => language.name.toLowerCase() === req.body.language).resources
    .find(resource => resource.id === req.body.resource).link
  common.log(email, path.dirname(__dirname) + '/var/mailingList.txt')
  mailer.download(email, resourceName, downloadLink)
  res.status(200).end()
})

// for when the user submits a form to recieve a download link
app.post('/email/unsubscribe/', (req, res) => {
  console.dir(req)
  let email = req.query.email
  mailer.unsubscribe(email)
  res.status(200).end()
})

// starts server
app.listen(PORT, () => common.log(`Server Started on port ${PORT}`))
