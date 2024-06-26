'use client'
import React, {useState, useEffect} from 'react'
import styles from "./page.module.css";
import axios from 'axios';
import appFirebase from '@/credenciales'
import { getAuth, signOut } from 'firebase/auth'
const auth = getAuth(appFirebase)

const HomeCliente = () => {

  const [libros, setLibros] = useState([]);

  useEffect(() => {
    const fetchLibros = async () => {
      try {
        const response = await axios.get('http://localhost:5000/libros');
        setLibros(response.data);
      } catch (error) {
        console.error('Error fetching the libros:', error);
      }
    };

    fetchLibros();
  }, []);

  
  const [seleccionado, setSeleccionado] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [mostrarcarrito, setMostrarcarrito] = useState(false)
  const agregaralcarrito = (libro) => {
    setCarrito([...carrito, libro]);      //agregar el libro seleccionado al array de libros en carrito
  };

  return (
    <main className={styles.main}>
      <header>
        <h1>Bookstore Online</h1>
        <button onClick={()=>setMostrarcarrito(!mostrarcarrito)}>Carrito</button>   {/* Mostrar carrito o no */}
        <button onClick={()=>signOut(auth)} className='btn btn-primary'>Cerrar sesión</button>  {/* boton cerrar sesion */}
      </header>
      <div>
        <h1>Libros disponibles</h1>
        <ul className={styles.bookList}>
          {libros.map((libro, index) => (                   /*mostrar libros tomando en cuenta el index de cada uno*/
            <li key={index} className={styles.bookItem}>
              <h2>{libro.titulo}</h2>
              <p>{libro.autor}</p> 
              <p>{libro.genero}</p>
              <button onClick={() => setSeleccionado(index === seleccionado ? null : index)}>ver</button> {/* una vez se presiona 'ver' se le asigna a la variable seleccionado el valor del index del libro o se borra si ya habia sido seleccionado */}
              {seleccionado === index && (    /* Si seleccionado tiene un valor de un index respectivo, se mostrara el boton de agregar carrito */
                <button onClick={() => agregaralcarrito(libro)}>Agregar al carrito</button>
              )}
            </li>
          ))}
        </ul>
        {mostrarcarrito && carrito.length > 0 && (  /* si mostrar carrito es verdadero y hay libros en el carrito se mostraran los libros agregados */
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
      </div>
    </main>
  )
}

export default HomeCliente
