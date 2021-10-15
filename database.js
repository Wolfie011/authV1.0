const mongoose = require('mongoose');
const chalk = require('chalk');

mongoose.connect('mongodb+srv://synchoe:Leauge1231@cluster0.5u7lp.mongodb.net/Testowy?retryWrites=true&w=majority', ()=>{
    console.log(chalk.blue('Połączono z bazą danych'));
})

module.exports = mongoose;