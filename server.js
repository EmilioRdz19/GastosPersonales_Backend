const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const monederoRoute = require('./app/routes/monedero.route');
const usuarioRoute = require('./app/routes/usuario.route');
const categoriaRoute = require('./app/routes/categoria.route');

require('dotenv').config()

mongoose.connect(`${process.env.MONGODB_URI}`)
  .then(() => {
    console.log('Conectados a la base de datos');
  })
  .catch((err) => {
    console.log('Error al conectar a la base de datos', err);
    process.exit();
  });



const corsOptions = {
  origin: process.env.FRONTEND_URL,
}

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

app.use('/api/v1/monedero', monederoRoute);
app.use('/api/v1/usuario', usuarioRoute);
app.use('/api/v1/categoria', categoriaRoute);

app.get('/', (req, res) => {
  res.send('<h1 align="center">Bienvenido a tus gastos personales</h1>');
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Servidor jalando en el puerto ${process.env.PORT || PORT} desde el dia ${new Date()}`);
});