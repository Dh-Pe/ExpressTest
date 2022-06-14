const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const admin = require('./routes/admin.js');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 3000;

app.use(session({
	secret: process.env.SECRET,
	resave: true,
	saveUninitialized: true
}));
app.use(flash());

app.use((req, res, next) => {
	res.locals.success_msg = req.flash("success_msg");
	res.locals.error_msg = req.flash("error_msg");
	next();
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb+srv://Hero:1592485236459@stamy.hjcbm.mongodb.net/?retryWrites=true&w=majority`).then(() => {
	console.log(`Conectado ao Banco de Dados.`);
}).catch((err) => {
	console.log("Erro ao se conectar ao Banco de Dados: "+err);
});

app.use('/admin', admin);

app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
	console.log('Servidor Rodando.');
});