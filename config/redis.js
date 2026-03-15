import IORedis from 'ioredis'

class RediSConnection {
  constructor() {
    this.connection = new IORedis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
    })
  }

  getConnection() {
    return this.connection
  }

  async close() {
    await this.connection.quit()
  }
}

export default RediSConnection