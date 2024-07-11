import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
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
  const [imagen, setImagen] = useState('');
  const [precio, setPrecio] = useState('');

  const db = getFirestore(appFirebase);

  useEffect(() => {
    fetchLibros();
  }, []);

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
        imagen,
        precio
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
      setImagen('');
      setPrecio('');
    } catch (error) {
      console.error('Error adding libro:', error);
    }
  };

  return (
    <div className="App">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ fontFamily: 'monospace', color: 'white', marginBlock: '20px' }}>Agregar Libro</h1>
        <form onSubmit={addLibro} className={styles.formAddBook}>
          <div className={styles.bookItem2}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <p style={{ color: 'rgb(122, 122, 122)', marginBottom: '0', marginTop: '10px', fontSize: '12px' }}>URL de imagen:</p>
              <input
                type="text"
                placeholder="URL de imagen"
                value={imagen}
                onChange={(e) => setImagen(e.target.value)}
                required
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'left', width: '100%' }}>
                <p style={{ color: 'rgb(122, 122, 122)', marginBottom: '0', marginTop: '10px', fontSize: '12px' }}>Título:</p>
                <input
                  type="text"
                  placeholder="Título"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                />
                <p style={{ color: 'rgb(122, 122, 122)', marginBottom: '0', marginTop: '10px', fontSize: '12px' }}>Autor:</p>
                <input
                  type="text"
                  placeholder="Autor"
                  value={autor}
                  onChange={(e) => setAutor(e.target.value)}
                  required
                />
                <div style={{ display: 'flex', flexDirection: 'row', marginTop: '5px', height: '25vh' }}>
                  <div style={{ width: '65%' }}>
                    <p style={{ color: 'rgb(122, 122, 122)', marginBottom: '0', marginTop: '10px', fontSize: '12px' }}>Resumen:</p>
                    <textarea
                      placeholder="Resumen"
                      value={resumen}
                      onChange={(e) => setResumen(e.target.value)}
                      required
                      style={{ height: '90%' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '15px', width: '22vh' }}>
                    <p style={{ color: 'rgb(122, 122, 122)', marginBottom: '0', marginTop: '10px', fontSize: '12px' }}>Género:</p>
                    <input
                      type="text"
                      placeholder="Género"
                      value={genero}
                      onChange={(e) => setGenero(e.target.value)}
                      required
                    />

                    <p style={{ color: 'rgb(122, 122, 122)', marginBottom: '0', marginTop: '10px', fontSize: '12px' }}>Fecha de publicación:</p>
                    <input
                      type="date"
                      placeholder="Fecha de publicación"
                      value={fechaPublicacion}
                      onChange={(e) => setFechaPublicacion(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <p style={{ color: 'rgb(122, 122, 122)', marginBottom: '0', marginTop: '20px', fontSize: '12px' }}>Precio:</p>
                <input
                  type="text"
                  placeholder="Precio"
                  value={precio}
                  onChange={(e) => setAutor(e.target.value)}
                  required
                />
                <p style={{ color: 'rgb(122, 122, 122)', marginBottom: '0', marginTop: '10px', fontSize: '12px' }}>ISBN:</p>
                <input
                  type="text"
                  placeholder="ISBN"
                  value={ISBN}
                  onChange={(e) => setISBN(e.target.value)}
                  required
                />
              </div>
            </div>
            <button className={styles.btnlibro1} type="submit">Agregar Libro</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
