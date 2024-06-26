const mongoose = require('mongoose');

const DB_URI = 'mongodb://localhost/bookstore';

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    console.log('********* CONEXIÓN CORRECTA *******');

    const LibroSchema = new mongoose.Schema({
      titulo: { type: String, required: true },
      autor: { type: String, required: true },
      año: { type: Number, required: true },
      genero: { type: String, required: true }
    }, { versionKey: false, timestamps: true });

    const Libro = mongoose.model('Libro', LibroSchema);

    // Asegurarse de que la base de datos esté inicializada si es necesario
    const existingCount = await Libro.countDocuments();
    if (existingCount === 0) {
      await Libro.create([
        { titulo: 'Libro 1', autor: 'Autor 1', año: 2001, genero: 'Ficción' },
        { titulo: 'Libro 2', autor: 'Autor 2', año: 2002, genero: 'No Ficción' }
      ]);
      console.log('Base de datos inicializada con libros de ejemplo.');
    }
  })
  .catch((err) => {
    console.error('********* ERROR DE CONEXIÓN *******', err);
  });
