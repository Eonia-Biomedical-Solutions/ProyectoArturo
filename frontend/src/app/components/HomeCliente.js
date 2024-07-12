import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { IoCartOutline, IoSearchCircle } from "react-icons/io5";
import { FiShoppingBag } from "react-icons/fi";
import { PiSignInThin, PiSignOutThin } from "react-icons/pi";
import { MdSupervisorAccount } from "react-icons/md";
import { FaMinusCircle } from "react-icons/fa";
import { collection, getFirestore, getDocs, doc, updateDoc, query, where, getDoc } from 'firebase/firestore';
import appFirebase from '@/credenciales';
import { getAuth, signOut } from 'firebase/auth';

const auth = getAuth(appFirebase);

const HomeCliente = ({ correousuario }) => {
  const [libros, setLibros] = useState([]);
  const [carrito, setCarrito] = useState({});
  const [mostrarcarrito, setMostrarcarrito] = useState(false);
  const [compras, setCompras] = useState([]);
  const [mostrarcompras, setMostrarcompras] = useState(false);
  const [filtroTitulo, setFiltroTitulo] = useState('');
  const [userData, setUserData] = useState(null);
  const [mostrarusuario, setMostrarusuario] = useState(false);
  const db = getFirestore(appFirebase);
  const currentUser = auth.currentUser;

  useEffect(() => {
    fetchCompras();
    fetchLibros();
    fetchUsuario();
  }, []);

  const fetchLibros = async () => {
    try {
      const librosRef = collection(db, 'libros');
      let queryLibros = librosRef;

      if (filtroTitulo) {
        queryLibros = query(librosRef,
          where('titulo', '>=', filtroTitulo),
          where('titulo', '<=', filtroTitulo + '\uf8ff')
        );
      }

      const querySnapshot = await getDocs(queryLibros);
      const fetchedLibros = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setLibros(fetchedLibros);
    } catch (error) {
      console.error('Error buscando libros:', error);
    }
  };

  const fetchCompras = async () => {
    if (currentUser) {
      try {
        const userDoc = await getDoc(doc(db, 'usuarios', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCompras(userData.compras || []);
        }
      } catch (error) {
        console.error('Error buscando compras:', error);
      }
    } else {
      console.log('Error buscando compras');
    }
  };

  const fetchUsuario = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const userDoc = await getDoc(doc(db, 'usuarios', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserData(userData);
        }
      } catch (error) {
        console.error('Error buscando usuario:', error);
      }
    }
  };

  const comprarbtn = () => {
    fetchCompras();
    setMostrarcarrito(false);
    setMostrarcompras(!mostrarcompras);
    setMostrarusuario(false);
  };

  const perfilbtn = () => {
    fetchUsuario();
    setMostrarcarrito(false);
    setMostrarcompras(false);
    setMostrarusuario(!mostrarusuario);
  };

  const carritobtn = () => {
    setMostrarcarrito(!mostrarcarrito);
    setMostrarcompras(false);
    setMostrarusuario(false);
  };

  const agregaralcarrito = (libro) => {
    const libroId = libro.id;
    if (carrito[libroId]) {
      const updatedCarrito = { ...carrito };
      updatedCarrito[libroId] += 1;
      setCarrito(updatedCarrito);
    } else {
      setCarrito({ ...carrito, [libroId]: 1 });
    }
  };

  const restaralcarrito = (libro) => {
    const libroId = libro.id;
    if (carrito[libroId]) {
      const updatedCarrito = { ...carrito };
      updatedCarrito[libroId] -= 1;

      if (updatedCarrito[libroId] <= 0) {
        delete updatedCarrito[libroId];
      }

      setCarrito(updatedCarrito);
    }
  };

  const comprarcarrito = async () => {
    if (currentUser) {
      const userRef = doc(db, 'usuarios', currentUser.uid);
      const librosComprados = Object.keys(carrito).reduce((acc, libroId) => {
        const cantidad = carrito[libroId];
        const libroSeleccionado = libros.find(libro => libro.id === libroId);
        if (libroSeleccionado) {
          acc.push({ ...libroSeleccionado, cantidad });
        }
        return acc;
      }, []);

      await updateDoc(userRef, {
        compras: [...compras, ...librosComprados],
      });

      setCompras([...compras, ...librosComprados]);
      setCarrito({});
      alert('¡Libros comprados con éxito!');
    } else {
      alert('Debes iniciar sesión para comprar');
    }
  };

  return (
    <main className={styles.main}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <header>
          <div className={styles.headercliente}>
            <h1 style={{ fontFamily: 'Monospace', color: 'white' }}>Bookstore Online by EONIA.</h1>
            <button className={styles.headerbutton} onClick={carritobtn}><IoCartOutline style={{ fontSize: '30px' }} /></button>
            <button className={styles.headerbutton} onClick={comprarbtn}><FiShoppingBag style={{ fontSize: '30px' }} /></button>
            <button className={styles.headerbutton} onClick={perfilbtn}><MdSupervisorAccount style={{ fontSize: '30px' }} /></button>
          </div>
        </header>
        {mostrarcarrito && Object.keys(carrito).length > 0 && (
          <div className={styles.carrito}>
            <h2 style={{ fontFamily: 'Arial', fontWeight: 'bold', fontSize: '25px' }}>Carrito</h2>
            <ul className={styles.listcarrito}>
              {Object.keys(carrito).map((libroId) => {
                const libro = libros.find(lib => lib.id === libroId);
                if (libro) {
                  return (
                    <li key={libroId}>
                      <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <img src={libro.imagen} className={styles.imgcarrito} />
                        <div style={{ display: 'flex', flexDirection: 'column', marginInline: '20px', width: '40vh' }}>
                          <p className={styles.textocarrito1}>{libro.titulo}</p>
                          <p className={styles.textocarrito2}>{libro.autor}</p>
                        </div>
                        <p className={styles.textocarrito1}>${libro.precio}</p>
                        <p style={{ marginLeft: '5px' }}> x {carrito[libroId]}</p>
                        <button onClick={() => restaralcarrito(libro)} style={{border:'0px', height: '8px', marginLeft: '24px'}}><FaMinusCircle style={{color: '#b30000'}}/></button>
                      </div>
                    </li>
                  );
                }
                return null;
              })}
            </ul>
            <button className={styles.comprarcarrito} onClick={comprarcarrito}><IoCartOutline /> Comprar carrito</button>
          </div>
        )}
        {mostrarcompras && compras.length > 0 && (
          <div className={styles.carrito}>
            <h2 style={{ fontFamily: 'Arial', fontWeight: 'bold', fontSize: '25px' }}>Compras</h2>
            <ul className={styles.listcarrito}>
              {compras.map((item, index) => (
                <li key={index}>
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <img src={item.imagen} className={styles.imgcarrito} />
                    <div style={{ display: 'flex', flexDirection: 'column', marginInline: '20px', width: '40vh' }}>
                      <p className={styles.textocarrito1}>{item.titulo}</p>
                      <p className={styles.textocarrito2}>{item.autor}</p>
                    </div>
                    <p className={styles.textocarrito1}>${item.precio}</p>
                    <p style={{ marginLeft: '5px' }}> x {item.cantidad}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {mostrarusuario && (
          <div className={styles.cajaperfil}>
            <div style={{ display: 'flex', flexDirection: 'row' , justifyContent: 'space-between'}}>
              <h2>Perfil</h2>
              <p>{userData.rol}</p>
            </div>
            <p> {userData.nombre}  {userData.apellido}</p>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <div style={{ display: 'flex', flexDirection: 'column', width: '35vh' }}>
                <p style={{ margin: '0' }}>Correo:</p>
                <p >{correousuario}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <p style={{ margin: '0' }}>Fecha de Nacimiento:</p>
                <p>{userData.fecha}</p>
              </div>
            </div>
            <button onClick={() => signOut(auth)} className={styles.comprarcarrito}><PiSignOutThin/> Cerrar sesión</button>
          </div>
        )}
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ margin: '44px', display: 'flex', flexDirection: 'row', backgroundColor: 'white', borderRadius: '20px' }}>
              <IoSearchCircle style={{ fontSize: '30px', color: 'rgb(11, 11, 11)' }} />
              <input
                type="text"
                placeholder="Buscar por título..."
                value={filtroTitulo}
                onChange={(e) => setFiltroTitulo(e.target.value)}
                style={{ paddingLeft: '20px', border: 'none', borderRadius: '20px', width: '70vh' }} />
            </div>
            <ul className={styles.bookList}>
              {libros
                .filter((libro) =>
                  libro.titulo.toLowerCase().includes(filtroTitulo.toLowerCase())
                )
                .map((libro, index) => (
                  <li key={index} className={styles.bookItem}>
                    <img src={libro.imagen} className={styles.imagenlibro} />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'left', width: '100%' }}>
                      <p className={styles.librotitulo}>{libro.titulo}</p>
                      <p className={styles.librotexto1}>{libro.autor}</p>
                      <div style={{ display: 'flex', flexDirection: 'row', marginTop: '5px' }}>
                        <div style={{ width: '65%' }}>
                          <p className={styles.librotexto2}>{libro.resumen}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '15px' }}>
                          <p className={styles.librotexto2}>{libro.genero}</p>
                          <p className={styles.librotexto2}>{libro.fechaPublicacion}</p>
                        </div>
                      </div>
                      <p className={styles.librotexto1}>${libro.precio}</p>
                    </div>
                    <button className={styles.btnlibro1} onClick={() => agregaralcarrito(libro)}> <IoCartOutline /> Agregar al carrito</button>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomeCliente;
