#!/usr/bin/env node
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({
	path: path.resolve(__dirname, 'production.env')
})
const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const api = require('./api');
const cronJobs = require('./utils/cronJobs');
const excelAPI = require('./utils/excelAPI');
const telegramAPI = require('./notifications/TelegramNotification');
const TermDeposit = require('./jobs/TermDeposit');

const PORT = 3000;

const app = new express();
app.use(bodyparser.json());
app.use(cors());

app.use('/', api);

app.get('/', async (req, res) => {
    // await excelAPI.test();
    // telegramAPI.test();
    // await TermDeposit.readExcel();
    res.send('Hello');
});

app.listen(PORT, function() {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Node env - ${process.env.NODE_ENV}`);
    cronJobs.executeCRONJobs();
    cronJobs.getTelegramUpdate();
});
