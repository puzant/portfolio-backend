import mongoose from "mongoose"
import { faker } from '@faker-js/faker'

import User from '#models/user.model.js'
import Project from "#models/project.model.js"
import Publication from "#models/publication.model.js"
import TravelImage from "#models/travelImage.model.js"

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("✅ Connected to MongoDB")

    await User.deleteOne({ email: "pbakjejian@hotmail.com" })
    await Project.deleteMany({})
    await Publication.deleteMany({})
    await TravelImage.deleteMany({})
    console.log("🗑️ Cleared existing data")

    const adminPassword = '462442'

    await User.create({
      name: "Puzant Bakjejian",
      email: "pbakjejian@hotmail.com",
      password: adminPassword,
      role: "admin",
      isActive: true,
      country: "Lebanon",
      city: "Beirut",
      preferences: {
        dragDropEnabled: true,
        cacheToggles: {
          projects: true,
          publications: true,
          travelImages: true,
        },
      },
    })

    console.log("✅ Admin user created (password: Admin123!)")

    // ==================== SEED PROJECTS ====================
    const projects = [];

    for (let i = 1; i <= 15; i++) {
      projects.push({
        name: faker.company.catchPhraseNoun(),
        description: faker.lorem.paragraphs(2),
        preview: faker.image.urlLoremFlickr(),
        link: faker.internet.url(),
        public_id: faker.string.alphanumeric(20),
        asset_id: faker.string.alphanumeric(20),
        priority: i,
        active: faker.datatype.boolean(0.9),
        repo: `https://github.com/${faker.internet.username()}/${faker.lorem.slug()}`,
      })
    }

    await Project.insertMany(projects)
    console.log(`✅ Seeded ${projects.length} projects`)

    // ==================== SEED PUBLICATIONS ====================
    const publications = [];

    for (let i = 0; i < 20; i++) {
      publications.push({
        title: faker.lorem.sentence(),
        preview: faker.lorem.paragraph(),
        publishedDate: faker.date.past({ years: 2 }),
        duration: `${faker.number.int({ min: 5, max: 45 })} min read`,
        link: faker.internet.url(),
        lastModified: new Date(),
      });
    }
    await Publication.insertMany(publications);
    console.log(`✅ Seeded ${publications.length} publications`);

    // ==================== SEED TRAVEL IMAGES ====================
    const countries = ["Lebanon", "Syria", "Armenia", "UAE", "Turkey", "France", "Italy", "Spain", "Greece"];
    const travelImages = [];
    
    for (let i = 1; i <= 30; i++) {
      travelImages.push({
        url: faker.image.urlLoremFlickr({ category: "nature" }),
        display_name: `${faker.helpers.arrayElement(countries)}`,
        asset_id: faker.string.alphanumeric(20),
        public_id: faker.string.alphanumeric(20),
        order: i,
        country: faker.helpers.arrayElement(countries),
      });
    }
    await TravelImage.insertMany(travelImages);
    console.log(`✅ Seeded ${travelImages.length} travel images`);

    console.log("🎉 Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err)
    process.exit(1)
  }
}

seedDatabase()