const fs = require('fs')
const path = require('path')
const mailgun = require("mailgun-js")
var http = require('http')
const mailchimp = require("@mailchimp/mailchimp_marketing");
const heml = require('heml');

const html2string = require('html-to-text');




const common = require('./common.js')
//const shareEmailTemplate = fs.readFileSync(common.root + '/lib/shareEmailTemplate.html', 'utf8')
const downloadHEML = fs.readFileSync(common.root + '/lib/email-templates/download.heml', 'utf8');
let downloadTemplate;
heml(downloadHEML, {validate: 'soft'})
.then(({ html, metadata, errors }) => {
  downloadTemplate = html;
});

// simple function to replace certain words with other ones.
// for example, if the data object is {firstName: "bob", lastName: "jones"}, then it will turn the template
// "My name is {{firstName}} {{lastName}}" into "My name is bob jones"
// this process happens after the HEML has been compiled to html
function fillTemplate (template, data) {
  Object.entries(data).forEach(([key, value]) => {
    template = template.replace(`{{${key}}}`, value);
  });
  return template;
}

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

  /* a previous share feature. we decided that this feature was uncecessary, so we disabled it */

  // async share (from, to, message, link, name) {
  //   // replace certain tags with request-specific info
  //   let shareHTML = shareEmailTemplate
  //     .replace("{from}", from)
  //     .replace("{to}", to)
  //     .replace("{message}", message)
  //     .replace("{link}", link)
  //     .replace("{name}", name)
  //   // send mail
  //   let data = {
  //     from: '"Songs for Saplings" <info@songsforsaplings.com>', // sender address
  //     to: to, // list of receivers
  //     subject: `A Note From "${from}"`, // Subject line
  //     text: `Someone shared one of our resources with you! They left a note: \n\n  ${message} \n\n${name} \n${link} \nWe hope you enjoy! If you find our resource helpful, please consider donating to our ministry.`, // plain text body
  //     html: shareHTML, // html body
  //   }
  //   this.mg.messages().send(data, function (err, body) {
  //     if (err) {
  //       common.log(err)
  //     }
  //   })
  // }

  async download (fields) {
    let shareBCC = encodeURIComponent("music-widget@songsforsaplings.com");
    let shareTitle = encodeURIComponent("Some great free music I found");
    let shareBody = encodeURIComponent("I found this great scripture-based kids' music that our family has really been enjoying. You should check it out. It's available for free on a bunch of platforms: https://music.songsforsaplings.com");
    const downloadTemplateData = {
      resourceName: fields.resourceName,
      downloadLink: fields.downloadLink,
      firstName: fields.firstName,
      websiteLink: "https://songsforsaplings.com",
      unsubscribeLink: "https://songsforsaplings.us14.list-manage.com/unsubscribe?u=09c372bf98b7d30635bd0cb5c&id=2458faf7dd",
      shareLink: `mailto:?bcc=${shareBCC}&subject=${shareTitle}&body=${shareBody}`,
      resourcesLink: "https://songsforsaplings.com/resources/free-guitar-chords-lyrics-and-sheet-music/#content",
      subject: "Your Free Download",
      logo: "https://music.songsforsaplings.com/logo%20big.png",
      donateLink: "https://songsforsaplings.com/donate",
      contactLink: "https://songsforsaplings.com/contact"
    };

    // replace certain parts of the message with the contents of templateData
    let downloadHTML = fillTemplate(downloadTemplate, downloadTemplateData);

    let downloadTXT = html2string.convert(downloadHTML, {
      wordwrap: 130
    });

    const emailData = {
      from: '"Songs for Saplings Music" <music-widget@songsforsaplings.com>', // sender address
      to: fields.email, // list of receivers
      subject: downloadTemplateData.subject, // Subject line
      text: downloadTXT, // plain text body
      html: downloadHTML, // html body
    };


    this.subscribe(fields.email, fields.firstName, fields.lastName);
    this.mg.messages().send(emailData, function (err, body) {
      if (err) {
        common.log(err);
      }
    });
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
