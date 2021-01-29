const fs = require('fs')
const path = require('path')
const mailgun = require("mailgun-js")
var http = require('http')
const mailchimp = require("@mailchimp/mailchimp_marketing");


const common = require('./common.js')
const shareEmailTemplate = fs.readFileSync(common.root + '/lib/shareEmailTemplate.html', 'utf8')
const downloadEmailTemplate = fs.readFileSync(common.root + '/lib/downloadEmailTemplate.html', 'utf8')

class Mailer {

  constructor (apis) {
    this.mg = mailgun({apiKey: apis.mailgun.key, domain: apis.mailgun.domain})
    mailchimp.setConfig({
      apiKey: apis.mailchimp.key,
      server: apis.mailchimp.prefix,
    });

    mailchimp.ping.get().then((response, err) => {
      if (err) {
        common.log(err)
      }
        common.log(response.health_status)
    })
  }

  async share (from, to, message, link, name) {
    // replace certain tags with request-specific info
    let shareHTML = shareEmailTemplate
      .replace("{from}", from)
      .replace("{to}", to)
      .replace("{message}", message)
      .replace("{link}", link)
      .replace("{name}", name)
    // send mail
    let data = {
      from: '"Songs for Saplings" <info@songsforsaplings.com>', // sender address
      to: to, // list of receivers
      subject: `A Note From "${from}"`, // Subject line
      text: `Someone shared one of our resources with you! They left a note: \n\n  ${message} \n\n${name} \n${link} \nWe hope you enjoy! If you find our resource helpful, please consider donating to our ministry.`, // plain text body
      html: shareHTML, // html body
    }
    this.mg.messages().send(data, function (err, body) {
      if (err) {
        common.log(err)
      }
    })
  }

  async download (fields) {
    // replace certain tags with request-specific info
    let downloadHTML = downloadEmailTemplate
      .replace("{resourceName}", fields.resourceName)
      .replace("{downloadLink}", fields.downloadLink)
      .replace("{firstName}", fields.firstName)
      .replace("{lastName}", fields.lastName)
      .replace("{unsubscribeLink}", "https://songsforsaplings.us14.list-manage.com/unsubscribe?u=09c372bf98b7d30635bd0cb5c&id=2458faf7dd")
      .replace("{techSupportLink}", "https://songsforsaplings.com/listenfree/")
      .replace("{resourcesLink}", "https://songsforsaplings.com/resources/free-guitar-chords-lyrics-and-sheet-music/#content")

    const data = {
      from: '"Songs for Saplings Widget" <info@widget.songsforsaplings.com>', // sender address
      to: fields.email, // list of receivers
      subject: "Your Free Download", // Subject line
      text: `Hi there, \nHere is your free download of ${fields.resourceName}. We hope you enjoy! \n${fields.downloadLink} \nIf you find our resource helpful, please consider donating to our ministry.`, // plain text body
      html: downloadHTML, // html body
    }
    this.subscribe(fields.email, fields.firstName, fields.lastName)
    this.mg.messages().send(data, function (err, body) {
      if (err) {
        common.log(err)
      }
    })
  }

  // subscribe through mailchimp api
  async subscribe(email, firstName, lastName) {
    const listId = "2458faf7dd"

    const response = await mailchimp.lists.addListMember(listId, {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }).catch((err) => {
      if (err.response.body.title != 'Member Exists') {
        common.log(err)
      }
    })
  }
}



module.exports = Mailer
