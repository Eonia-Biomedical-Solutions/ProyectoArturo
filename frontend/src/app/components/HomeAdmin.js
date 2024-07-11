import React, { useEffect, useState } from 'react';
import { PiSignInThin, PiSignOutThin } from "react-icons/pi";
import { MdSupervisorAccount } from "react-icons/md";
import styles from './page.module.css'
import { collection, getFirestore, getDocs, doc, updateDoc, query, where, getDoc } from 'firebase/firestore';
import AddBook from './AddBook';
import UsuariosAdmin from './UsuariosAdmin';
import AdminBook from './AdminBook';
import appFirebase from '@/credenciales';
import { getAuth, signOut } from 'firebase/auth';

const auth = getAuth(appFirebase)

const HomeAdmin = ({ correousuario }) => {
  const [mostraragregar, setMostraragregar] = useState(false);
  const [mostrarusuarios, setMostrarusuarios] = useState(false);
  const [mostrarusuario, setMostrarusuario] = useState(false);
  const [mostrarlibros, setMostrarlibros] = useState(true);
  const [userData, setUserData] = useState(null);

  const db = getFirestore(appFirebase);

  useEffect(() => {
    fetchUsuario();
  }, [])

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

  const perfilbtn = () => {
    fetchUsuario();
    setMostrarusuario(!mostrarusuario);
  };



  return (
    <div className={styles.main}>
      <header>
        <div className={styles.headeradmin}>
          <h1 style={{ fontFamily: 'Monospace', color: 'white', marginRight: '60px' }}>Bookstore Online by EONIA.</h1>
          <button onClick={() => setMostraragregar(!mostraragregar)}>Agregar libro</button>
          <button onClick={() => setMostrarusuarios(!mostrarusuarios)}>Administrar usuarios </button>
          <button onClick={() => setMostrarlibros(!mostrarlibros)}>Administrar libros</button>
          <button className={styles.headerbutton} onClick={perfilbtn}><MdSupervisorAccount style={{ fontSize: '30px' }} /></button>
        </div>
      </header>
      <div>
        {mostrarusuario && (
          <div className={styles.cajaperfil}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <h2>Perfil</h2>
              <p>{userData.rol}</p>
            </div>
            <p> {userData.nombre}  {userData.apellido}</p>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <div style={{ display: 'flex', flexDirection: 'column', width: '45vh' }}>
                <p style={{ margin: '0' }}>Correo:</p>
                <p >{correousuario}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <p style={{ margin: '0' }}>Fecha de Nacimiento:</p>
                <p>{userData.fecha}</p>
              </div>
            </div>
            <button onClick={() => signOut(auth)} className={styles.comprarcarrito}><PiSignOutThin /> Cerrar sesión</button>
          </div>
        )}
      </div>
      <div>
        {mostraragregar && (
          <div className={styles.divborder}>
            <div style={{ marginBottom: '50px' }}>
              <AddBook />
            </div>
          </div>
        )}
        {mostrarusuarios && (
          <div className={styles.divborder}>
            <div style={{ marginBottom: '50px' }}>
              <UsuariosAdmin />
            </div>
          </div>
        )}
        {mostrarlibros && (
          <div className={styles.divborder}>
            <div style={{ marginBottom: '50px' }}>
              <AdminBook />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeAdmin;
