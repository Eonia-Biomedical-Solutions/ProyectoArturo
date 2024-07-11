const express = require('express');
const cors = require('cors');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, doc, deleteDoc } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

const app = express();
app.use(cors({
  origin: 'http://localhost:3000' 
}));
app.use(express.json());

// Inicializa la aplicación Firebase Admin
const serviceAccount = require('./bookstoreonline.json'); 
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
const auth = getAuth();

// Ruta para registrar o autenticar usuarios
app.post('/auth', async (req, res) => {
  const { email, password, nombre, apellido, fecha, rol } = req.body;

  if (req.body.registrando) {
    try {
      const userRecord = await auth.createUser({
        email: email,
        password: password
      });

      // Guardar información adicional del usuario en Firestore
      await setDoc(doc(db, "usuarios", userRecord.uid), {
        email: email,
        rol: rol,
        nombre: nombre,
        apellido: apellido,
        fecha: fecha
      });

      res.status(200).send({ message: 'Usuario registrado exitosamente.' });
    } catch (error) {
      res.status(500).send({ error: 'Error al registrar usuario:', message: error.message });
    }
  } else {
    try {
      const user = await auth.getUserByEmail(email);
      res.status(200).send({ message: 'Usuario autenticado exitosamente.' });
    } catch (error) {
      res.status(500).send({ error: 'Error al autenticar usuario:', message: error.message });
    }
  }
});

// Ruta para eliminar usuarios
app.delete('/usuarios/:uid', async (req, res) => {
  const uid = req.params.uid;

  try {
    // Eliminar de Firestore
    await db.collection('usuarios').doc(uid).delete();
    
    // Eliminar de Firebase Authentication
    await auth.deleteUser(uid);

    res.status(200).send({ message: 'Usuario eliminado exitosamente.' });
  } catch (error) {
    res.status(500).send({ error: 'Error al eliminar usuario:', message: error.message });
  }
});

// Ruta para agregar libros
app.post('/libros', async (req, res) => {
  const { titulo, autor, ISBN, genero, fechaPublicacion, resumen, imagen, precio } = req.body;

  try {
    const libroRef = doc(db, 'libros', 'id-generado-automaticamente'); // Crea una referencia al documento
    await setDoc(libroRef, {
      titulo: titulo,
      autor: autor,
      ISBN: ISBN,
      genero: genero,
      fechaPublicacion: fechaPublicacion,
      resumen: resumen,
      imagen: imagen,
      precio: precio
    });
    res.status(200).send({ message: 'Libro agregado exitosamente.' });
  } catch (error) {
    res.status(500).send({ error: 'Error al agregar libro:', message: error.message });
  }
});

// Ruta para modificar libros
app.put('/libros/:id', async (req, res) => {
  const id = req.params.id;
  const { titulo, autor, ISBN, genero, fechaPublicacion, resumen, imagen, precio } = req.body;

  try {
    const libroRef = doc(db, 'libros', id);
    await updateDoc(libroRef, {
      titulo: titulo,
      autor: autor,
      ISBN: ISBN,
      genero: genero,
      fechaPublicacion: fechaPublicacion,
      resumen: resumen,
      imagen: imagen,
      precio: precio
    });
    res.status(200).send({ message: 'Libro actualizado exitosamente.' });
  } catch (error) {
    res.status(500).send({ error: 'Error al actualizar libro:', message: error.message });
  }
});

// Ruta para eliminar libros
app.delete('/libros/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const libroRef = doc(db, 'libros', id);
    await deleteDoc(libroRef);
    res.status(200).send({ message: 'Libro eliminado exitosamente.' });
  } catch (error) {
    res.status(500).send({ error: 'Error al eliminar libro:', message: error.message });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
