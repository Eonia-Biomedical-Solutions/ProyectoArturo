import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { collection, getFirestore, getDocs, doc, updateDoc } from 'firebase/firestore';
import appFirebase from '@/credenciales';
import { getAuth, signOut } from 'firebase/auth';

const auth = getAuth(appFirebase);

const HomeCliente = () => {
  const [libros, setLibros] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [mostrarcarrito, setMostrarcarrito] = useState(false);
  const [compras, setCompras] = useState([]);
  const [mostrarcompras, setMostrarcompras] = useState(false);
  const [filtroTitulo, setFiltroTitulo] = useState('');
  const db = getFirestore(appFirebase);
  const currentUser = getAuth().currentUser;

  useEffect(() => {
    fetchLibros();
  }, []);

  const fetchLibros = async () => {
    try {
      const librosRef = collection(db, 'libros');
      let query = librosRef;

      if (filtroTitulo) {
        query = query.where('titulo', '>=', filtroTitulo)
          .where('titulo', '<=', filtroTitulo + '\uf8ff');
      }

      const querySnapshot = await getDocs(query);
      const fetchedLibros = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setLibros(fetchedLibros);
    } catch (error) {
      console.error('Error fetching libros:', error);
    }
  };

  const agregaralcarrito = (libro) => {
    setCarrito([...carrito, libro]);
  };

  const comprarcarrito = async () => {
    if (currentUser) {
      const userRef = doc(db, 'usuarios', currentUser.uid);
      await updateDoc(userRef, {
        compras: [...compras, ...carrito],
      });

      setCompras([...compras, ...carrito]);
      setCarrito([]);
      alert('¡Libros comprados con éxito!');
    } else {
      alert('Debes iniciar sesión para comprar');
    }
  };

  return (
    <main className={styles.main}>
      <header>
        <h1>Bookstore Online</h1>
        <button onClick={() => setMostrarcarrito(!mostrarcarrito)}>Carrito</button>
        <button onClick={comprarcarrito}>Comprar carrito</button>
        <button onClick={() => setMostrarcompras(!mostrarcompras)}>Compras</button>
        <button onClick={() => signOut(auth)} className='btn btn-primary'>Cerrar sesión</button>
      </header>
      <div>
        <h1>Libros disponibles</h1>
        <div>
          <input
            type="text"
            placeholder="Buscar por título..."
            value={filtroTitulo}
            onChange={(e) => setFiltroTitulo(e.target.value)}
          />
          <ul className={styles.bookList}>
            {libros
              .filter((libro) =>
                libro.titulo.toLowerCase().includes(filtroTitulo.toLowerCase())
              )
              .map((libro, index) => (
                <li key={index} className={styles.bookItem}>
                  <h2>{libro.titulo}</h2>
                  <p>{libro.autor}</p>
                  <p>{libro.genero}</p>
                  <button onClick={() => setSeleccionado(index === seleccionado ? null : index)}>ver</button>
                  {seleccionado === index && (
                    <button onClick={() => agregaralcarrito(libro)}>Agregar al carrito</button>
                  )}
                </li>
              ))}
          </ul>
        </div>
        {mostrarcarrito && carrito.length > 0 && (
          <div>
            <h2>Carrito</h2>
            <ul>
              {carrito.map((item, index) => (
                <li key={index}>
                  <h3>{item.titulo}</h3>
                  <p>{item.autor}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        {mostrarcompras && compras.length > 0 && (
          <div>
            <h2>Compras</h2>
            <ul>
              {compras.map((item, index) => (
                <li key={index}>
                  <h3>{item.titulo}</h3>
                  <p>{item.autor}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
};
  export default HomeCliente;