import React, { useState, useEffect } from 'react';
import { collection, getFirestore, addDoc, deleteDoc, getDocs } from 'firebase/firestore';
import appFirebase from '@/credenciales';

const AddBook = () => {
  const [libros, setLibros] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [ISBN, setISBN] = useState('');
  const [genero, setGenero] = useState('');
  const [fechaPublicacion, setFechaPublicacion] = useState('');
  const [resumen, setResumen] = useState('');

  const db = getFirestore(appFirebase); // Get Firestore instance

  useEffect(() => {
    fetchLibros();
  }, []); // Run only once on component mount

  const fetchLibros = async () => {
    try {
      const librosRef = collection(db, 'libros');
      const querySnapshot = await getDocs(librosRef);
      const fetchedLibros = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setLibros(fetchedLibros);
    } catch (error) {
      console.error('Error fetching libros:', error);
    }
  };

  const addLibro = async (e) => {
    e.preventDefault();
    try {
      const newLibro = {
        titulo,
        autor,
        ISBN,
        genero,
        fechaPublicacion,
        resumen,
      };
      const librosRef = collection(db, 'libros');
      const docRef = await addDoc(librosRef, newLibro);
      setLibros([...libros, { ...newLibro, id: docRef.id }]);
      setTitulo('');
      setAutor('');
      setISBN('');
      setGenero('');
      setFechaPublicacion('');
      setResumen('');
    } catch (error) {
      console.error('Error adding libro:', error);
    }
  };

  return (
    <div className="App">
      <h1>Agregar Libro</h1>
      <form onSubmit={addLibro}>
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Autor"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="ISBN"
          value={ISBN}
          onChange={(e) => setISBN(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Género"
          value={genero}
          onChange={(e) => setGenero(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Fecha de publicación"
          value={fechaPublicacion}
          onChange={(e) => setFechaPublicacion(e.target.value)}
          required
        />
        <textarea
          placeholder="Resumen"
          value={resumen}
          onChange={(e) => setResumen(e.target.value)}
          required
        />
        <button type="submit">Agregar Libro</button>
      </form>
    </div>
  );
};

export default AddBook;
