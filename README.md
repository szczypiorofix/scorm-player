# scorm-player
A simple player for a SCORM files

## Simple backend example:

- package.json
```
{
  "name": "scorm-player-backend",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
    "start": "nodemon ./app.js localhost 3000"
  },
  "author": "",
  "license": "MIT",
  "description": "",
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^5.1.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.10"
  }
}

```

- app.js:
```
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

let progressData = {};

console.log("Simple in-memory database has been initialized.");
console.log('Remember, the database data will be deleted after the server restart.')

const loggerMiddleware = function (req, res, next) {
    console.log(`Request: [${req.method}] ${req.host}${req.url}`);
    next();
}

const jsonMiddleware = function(req, res, next) {
    res.header('Content-Type', 'application/json');
    next();
}

app.use(express.json());
app.use(cors());

app.use(loggerMiddleware);
app.use(jsonMiddleware);

app.get('/', (req, res) => {
    const response = {
        app_name: 'SCORM Player',
        app_ver: '1.0.0'
    }
    res.send(response)
});

app.get('/api/progress/:userId/:courseId', (req, res) => {
    const { userId, courseId } = req.params;
    const key = `${userId}-${courseId}`;

    const data = progressData[key];

    if (data) {
        console.log(`✅ Received progress for user ${userId} and course ${courseId}.`);
        res.status(200).json(data);
    } else {
        const message = `⚠️ Did not found progress data for user ${userId} and course ${courseId}.`;
        console.log(message);
        res.status(404).json({ message: message });
    }
});

app.post('/api/progress/:userId/:courseId', (req, res) => {
    const { userId, courseId } = req.params;
    const key = `${userId}-${courseId}`;
    const newProgress = req.body;

    progressData[key] = newProgress;

    console.log(`💾 Saved progress for user ${userId} and course ${courseId}.`, newProgress);
    res.status(200).json({
        message: 'Postęp zapisany pomyślnie.',
        savedData: newProgress
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server started at http://localhost:${PORT}`);
});

```
