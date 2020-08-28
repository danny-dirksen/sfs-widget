const fs = require('fs')
const path = require('path')
const mailgun = require("mailgun-js")
var http = require('http')
const mailchimp = require("@mailchimp/mailchimp_marketing");

const common = require('./common.js')
const shareEmailTemplate = fs.readFileSync(common.root + '/lib/shareEmailTemplate.html', 'utf8')
const downloadEmailTemplate = fs.readFileSync(common.root + '/lib/downloadEmailTemplate.html', 'utf8')

class Mailer {
  constructor (api) {
    this.mg = mailgun({apiKey: api.key, domain: api.domain})
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
    const data = {
      from: '"Songs for Saplings" <info@songsforsaplings.com>', // sender address
      to: to, // list of receivers
      subject: `A Note From "${from}"`, // Subject line
      text: `Someone shared one of our resources with you! They left a note: \n\n  ${message} \n\n${name} \n${link} \nWe hope you enjoy! If you find our resource helpful, please consider donating to our ministry.`, // plain text body
      html: shareHTML, // html body
    }
    this.mg.messages().send(data, function (error, body) {
      common.log(body)
    })
  }

  async download (to, name, link) {
    // replace certain tags with request-specific info
    let downloadHTML = downloadEmailTemplate
      .replace("{albumname}", name)
      .replace("{downloadlink}", link)
      .replace("{unsubscribelink}", "unsubscribe.test")

    const data = {
      from: '"Songs for Saplings" <info@songsforsaplings.com>', // sender address
      to: to, // list of receivers
      subject: "Your Free Download", // Subject line
      text: `Hi there, \nHere is your free download of ${name}. We hope you enjoy! \n${link} \nIf you find our resource helpful, please consider donating to our ministry.`, // plain text body
      html: downloadHTML, // html body
    }
    this.mg.messages().send(data, function (error, body) {
      common.log(body);
    });
  }
  async subscribe(email, firstName, lastName) {
    const listId = "2458faf7dd";
    const subscribingUser = {
      email: email,
      firstName: null,
      lastName: null
    };

    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName
      }
    }
    common.log(response)
  }

  async unsubscribe(email) {

  }
}



module.exports = Mailer
