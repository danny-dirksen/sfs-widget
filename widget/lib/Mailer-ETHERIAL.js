const nodemailer = require("nodemailer")
const fs = require('fs')
const path = require('path')

const common = require('./common.js')
const rootPath = path.dirname(__dirname)
const shareEmailTemplate = fs.readFileSync(rootPath + '/lib/shareEmailTemplate.html', 'utf8')
const downloadEmailTemplate = fs.readFileSync(rootPath + '/lib/downloadEmailTemplate.html', 'utf8')

class Mailer {
  constructor () {
    // Generate test SMTP service account from ethereal.email
    nodemailer.createTestAccount((err, account) => {
      this.account = account
      try {
        // create reusable transporter object using the default SMTP transport
        this.transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: this.account.user, // generated ethereal user
            pass: this.account.pass, // generated ethereal password
          },
        })
      } catch (err) {
        common.log(err)
      }
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
    try {
      // send mail with defined transport object
      let info = await this.transporter.sendMail({
        from: '"Songs for Saplings" <info@songsforsaplings.com>', // sender address
        to: to, // list of receivers
        subject: `A Note From "${from}"`, // Subject line
        text: `Someone shared one of our resources with you! They left a note: \n\n  ${message} \n\n${name} \n${link} \nWe hope you enjoy! If you find our resource helpful, please consider donating to our ministry.`, // plain text body
        html: shareHTML, // html body
      })

      common.log("Message sent: " + info.messageId)
      common.log("Preview URL: " + nodemailer.getTestMessageUrl(info))

    } catch (err) {
      common.log(err)
    }
  }

  async download (to, name, link) {
    // replace certain tags with request-specific info
    let downloadHTML = downloadEmailTemplate
      .replace("{albumname}", name)
      .replace("{downloadlink}", link)
      .replace("{unsubscribelink}", "unsubscribe.test")
    try {
      // send mail with defined transport object
      let info = await this.transporter.sendMail({
        from: '"Songs for Saplings" <info@songsforsaplings.com>', // sender address
        to: to, // list of receivers
        subject: "Your Free Download", // Subject line
        text: `Hi there, \nHere is your free download of ${name}. We hope you enjoy! \n${link} \nIf you find our resource helpful, please consider donating to our ministry.`, // plain text body
        html: downloadHTML, // html body
      })

      common.log("Message sent: " + info.messageId)
      common.log("Preview URL: " + nodemailer.getTestMessageUrl(info))

    } catch (err) {
      common.log(err)
    }
  }

  async unsubscribe(email) {

  }
}



module.exports = Mailer
