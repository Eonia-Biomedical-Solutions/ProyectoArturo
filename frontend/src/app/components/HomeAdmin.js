import React, { useState } from 'react';
import { getFirestore } from 'firebase/firestore';
import AddBook from './AddBook';
import UsuariosAdmin from './UsuariosAdmin';
import AdminBook from './AdminBook';
import appFirebase from '@/credenciales'; // Replace with your Firebase configuration
import { getAuth, signOut } from 'firebase/auth';

const auth = getAuth(appFirebase)

const HomeAdmin = ({ correousuario }) => {
  const [mostraragregar, setMostraragregar] = useState(false);
  const [mostrarusuarios, setMostrarusuarios] = useState(false);
  const [mostrarlibros, setMostrarlibros] = useState(false);

  const db = getFirestore(appFirebase); // Get Firestore instance



  return (
    <div className="App">
      <h1>Bienvenido {correousuario} </h1>
      <h2>¿Qué acción desea realizar?</h2>

      <button onClick={() => signOut(auth)} className="btn btn-primary">Cerrar sesión</button>
      <button onClick={() => setMostraragregar(!mostraragregar)}>Agregar libro</button>
      <button onClick={() => setMostrarusuarios(!mostrarusuarios)}>Administrar usuarios </button>
      <button onClick={() => setMostrarlibros(!mostrarlibros)}>Administrar libros</button>
      <div>
        {mostraragregar && (
          <AddBook />
        )}
        {mostrarusuarios && (
          <UsuariosAdmin />
        )}
        {mostrarlibros && (
          <AdminBook/>
        )}
      </div>
    </div>
  );
};

export default HomeAdmin;
