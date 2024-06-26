const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors'); // Import the cors library
require('./database');

const app = express();
app.use(express.json());

// Add CORS middleware with your client-side origin
app.use(cors({
  origin: 'http://localhost:3000' // Replace with your actual client-side origin
}));

const LibroSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  autor: { type: String, required: true },
  año: { type: Number, required: true },
  genero: { type: String, required: true }
}, { versionKey: false, timestamps: true });

const Libro = mongoose.model('Libro', LibroSchema);

// Rutas de API
app.get('/libros', async (req, res) => {
  const libros = await Libro.find();
  res.json(libros);
});

app.post('/libros', async (req, res) => {
  const nuevoLibro = new Libro(req.body);
  await nuevoLibro.save();
  res.status(201).json(nuevoLibro);
});

app.delete('/libros/:id', async (req, res) => {
  await Libro.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
