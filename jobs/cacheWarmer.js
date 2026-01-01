import { CronJob } from "cron";
import { cache } from '../cache.js'
import Project from '#models/project.model.js'
import Publication from '#models/publication.model.js'
import TravelImage from '#models/travelImage.model.js'

console.log('Cache warmer cron job initialized...');

const onComplete = () => {
  console.log('✅ Cron job has completed')
}

export const cacheWarmerJob = new CronJob('0 */11 * * *', async () => {
  console.log('♻️ Warming cache — fetching fresh data...');
  
  try {
    const [projects, publications, travelImages] = await Promise.all([
      Project.find().sort({ priority: 1 }).lean(),
      Publication.find().lean(),
      TravelImage.find().sort({ order: 1 }).lean()
    ])

    cache.set('projects', projects, 43200)
    cache.set('publications', publications, 43200)
    cache.set('travelImages', travelImages, 43200)

    console.log('✅ Cache successfully warmed');
    console.log(`• Projects: ${projects.length}`);
    console.log(`• Publications: ${publications.length}`);
    console.log(`• Travel Images: ${travelImages.length}`);
  } catch (err) {
    console.error('❌ Cache warming failed:', err.message);
  }
}, onComplete, true)