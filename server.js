const express = require('express');
const app = express();
const PORT = 3333;
const chalk = require('chalk');

app.use(require('./routes/posts'));
app.use(require('./routes/users'));


app.listen(PORT, ()=>{
    console.log(chalk.green(`Serwer wystartował na PORT : ${PORT}`));
})

app.get('/test', (req, res)=>{
    res.sendStatus(200);
})