'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const env = require('./config/env');
const apiRoutes = require('./routes/index');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.isDev() ? '*' : process.env.ALLOWED_ORIGINS?.split(',') ?? [],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(morgan(env.isDev() ? 'dev' : 'combined'));

app.use(express.json({ limit: '10kb' }));          
app.use(express.urlencoded({ extended: true }));


app.use('/api/v1', apiRoutes);


app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});


app.use(errorHandler);

module.exports = app;
