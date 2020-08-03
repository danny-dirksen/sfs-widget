const nodemailer = require("nodemailer");
const fs = require('fs')

let songs = require('../public/songs.json');;
const Logger = require('./Logger.js');
const logger = new Logger();

class Mailer {
  constructor () {
    // Generate test SMTP service account from ethereal.email
    nodemailer.createTestAccount((err, account) => {
      this.account = account
      //logger.log(this.account);
    });

  }

  async sendDownloadLink () {
      try {
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: this.account.user, // generated ethereal user
          pass: this.account.pass, // generated ethereal password
        },
      });

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"Songs for Saplings" <foo@example.com>', // sender address
        to: "daniel@dirksen.com", // list of receivers
        subject: "Free Download Link", // Subject line
        text: `Below is the download link for your resource. Have a great day!\n\nhttps://example.com`, // plain text body
        html: `Below is the download link for your resource. Have a great day!<br><b><a href="https://example.com">Download</b>`, // html body
      });

      logger.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      logger.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    } catch (err) {
      logger.log(err)
    }
  }
}



module.exports = Mailer;
