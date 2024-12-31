import { CronJob } from 'cron'
import https from 'https'

import { cache } from './cache.js'

const render_backend_URL = 'https://portfolio-backend-gq2s.onrender.com/api/travel-images'

const onComplete = () => {
  console.log('Cron job has completed')
}

export const wakeupJob = new CronJob('*/13 * * * *', () => {
  console.log('Pinging Server.....')

  https.get(render_backend_URL, (res) => {
    const chunks = []

    res.on('data', (chunk) => {
      chunks.push(chunk)
    });

    res.on('end', () => {
      const body = Buffer.concat(chunks).toString();
      if (res.statusCode === 200) {
        if (!cache.get('travelImages')) cache.set('travelImages', body)

        console.log('server pinged!', body)
      } else {
        console.error(`failed to ping the server ${res.statusCode}`)
      }
    })   
  }).on('error', (err) => {
    console.error(`Error pinging server: ${err.message}`);
  })
}, onComplete, true)
