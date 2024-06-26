'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import appFirebase from '@/credenciales'
import { getAuth, signOut } from 'firebase/auth'
const auth = getAuth(appFirebase)


const HomeAdmin = ({correousuario}) => {
  const [libros, setLibros] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [año, setAño] = useState('');
  const [genero, setGenero] = useState('');

  useEffect(() => {
    fetchLibros();
  }, []);

  const fetchLibros = async () => {
    try {
      const response = await axios.get('http://localhost:5000/libros');
      console.log('Libros recibidos:', response.data); // Verifica los datos recibidos
      setLibros(response.data);
    } catch (error) {
      console.error('Error fetching libros:', error);
    }
  };

  const addLibro = async (e) => {
    e.preventDefault();
    try {
      const newLibro = { titulo, autor, año: parseInt(año), genero };
      const response = await axios.post('http://localhost:5000/libros', newLibro);
      setLibros([...libros, response.data]);
      setTitulo('');
      setAutor('');
      setAño('');
      setGenero('');
    } catch (error) {
      console.error('Error adding libro:', error);
    }
  };

  const deleteLibro = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/libros/${id}`);
      setLibros(libros.filter((libro) => libro._id !== id));
    } catch (error) {
      console.error('Error deleting libro:', error);
    }
  };

  return (
    <div className="App">
      <h1>Libros</h1>
      <button onClick={()=>signOut(auth)} className='btn btn-primary'>Cerrar sesión</button>
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
          type="number"
          placeholder="Año"
          value={año}
          onChange={(e) => setAño(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Género"
          value={genero}
          onChange={(e) => setGenero(e.target.value)}
          required
        />
        <button type="submit">Agregar Libro</button>
      </form>
      <ul>
        {libros.map((libro) => (
          <li key={libro._id}>
            <strong>{libro.titulo}</strong> - {libro.autor} ({libro.año}) [{libro.genero}]
            <button onClick={() => deleteLibro(libro._id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomeAdmin