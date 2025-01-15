# Portfolio Backend

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Nodemon](https://img.shields.io/badge/NODEMON-%23323330.svg?style=for-the-badge&logo=nodemon&logoColor=%BBDEAD)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![EJS](https://img.shields.io/badge/ejs-%23B4CA65.svg?style=for-the-badge&logo=ejs&logoColor=black)
![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white)

This repository contains the backend for the portfolio website. It is built using Node.js, Express, and the Cloudinary SDK to manage and serve travel-related images.

Access the API at `https://portfolio-backend-gq2s.onrender.com`.

## API Endpoints
**Projects**
| **Endpoint**   | **Method**  | **Description**  | **Data Fields** |
| -------- | ------- | ------- | ------- |
| /projects/api  | GET    |  Get all projects  | N/A
| /projects/api/add  | POST    |  Create new project  | name, descrption, preview, link
| /projects/api/edit/:id  | POST    |  Edit project  | name, descrption, preview, link
| /projects/api/delete/:id  | DELETE    |  Delete project  | id

**Publications**
| **Endpoint**   | **Method**  | **Description**  | **Data Fields** |
| -------- | ------- | ------- | ------- |
| /publications/api  | GET    |  Get all publications | N/A
| /publications/api/add  | POST    |  Create new publication | title, preview, publishedDate, duration, link
| /publications/api/edit/:id  | POST    |  Edit publication  | name, descrption, preview, link
| /publications/api/delete/:id  | DELETE    |  Delete publication  | id

**Travel Images**
| **Endpoint**   | **Method**  | **Description**  |
| -------- | ------- | ------- |
| /travel-images/api  | GET    |  Get all travel images |
| /travel-images/api/add  | POST    | Add new travel image |
| /travel-images/api/delete/:imageName  | DELETE |  Delete travel image  |

## Features
- **Node.js**: The backend runtime environment.
- **Express**: Lightweight and flexible web framework.
- **Cloudinary SDK**: Used for fetching and managing images stored in Cloudinary.
- **Deployed on Render**: Easily accessible and scalable deployment.
- **WebP Image Format**: Optimized image format for faster load times.
- **Cron Job**: Set to run every 13 minutes, sending an HTTP request to the API to prevent it from entering hibernation mode.
- **Node Cache:** Caches Cloudinary images with a 12-hour TTL, improving performance and reducing redundant requests.

## Dependencies
- **Node.js**: Runtime environment
- **Express**: Web framework
- **Cloudinary SDK**: Cloud image management
