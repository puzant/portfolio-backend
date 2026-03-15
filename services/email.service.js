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

  async sendPasswordChangedEmail(user, req) {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Changed",
      text: `
        Your Password was changed
        User: ${user.email}
        User ID: ${user.id}
        IP: ${req.ip}
        Time: ${new Date()}
      `
    })
  }
}

export default EmailService