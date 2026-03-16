import IORedis from 'ioredis'

class RediSConnection {
  constructor() {
    if (!RediSConnection.instance) {
      this.connection = new IORedis(process.env.REDIS_URL, {
        maxRetriesPerRequest: null,
      })
      RediSConnection.instance = this
    }
    return RediSConnection.instance
  }

  getConnection() {
    return this.connection
  }

  async close() {
    await this.connection.quit()
  }
}

export default RediSConnection