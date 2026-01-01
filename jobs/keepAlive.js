import dotenv  from 'dotenv'
import { CronJob } from 'cron'

dotenv.config()
const render_backend_URL = `${process.env.RENDER_BACKEND_URL}/v1/travel-images`

export const keepAliveJob = new CronJob('*/13 * * * *', async () => {
  try {
    await fetch(render_backend_URL)
    console.log('🔔 Keep-alive ping sent')
  } catch (err) {
    console.error('Ping failed:', err.message);
  }
}, null, true)
