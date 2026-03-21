import crypto from 'crypto'

class TokenService {
  generateResetToken() {
    const rawToken = crypto.randomBytes(48).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex')

    return { rawToken, hashedToken }
  }

  hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex')
  }
}

export default new TokenService()