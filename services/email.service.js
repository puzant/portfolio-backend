import ejs from 'ejs'
import path from 'path'
import nodeMailer from 'nodemailer'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

class EmailService {
  constructor() {
    this.transporter = nodeMailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
  }

  async sendPasswordChangedEmail(data) {
    const { email, name, ipAddress, userAgent } = data

    const templatePath = path.join(__dirname, '../templates/password-changed.ejs')
    const html = await ejs.renderFile(templatePath, {
      username: name, 
      changeTime: new Date().toLocaleString(),
      ipAddress: ipAddress,
      userAgent: userAgent
    })

    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Changed",
      html: html
    })
  }
}

export default EmailService