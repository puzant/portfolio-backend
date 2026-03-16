import nodeMailer from 'nodemailer'

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
    const { email, ipAddress } = data

    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Changed",
      text: `
        Your Password was changed
        User: ${email}
        IP: ${ipAddress}
        Time: ${new Date()}
      `
    })
  }
}

export default EmailService