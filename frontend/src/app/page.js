'use client'
import React, { useState, useEffect } from 'react';
import appFirebase from '@/credenciales';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

import Login from './components/Login';
import HomeCliente from './components/HomeCliente';
import HomeAdmin from './components/HomeAdmin';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userFirebase) => {
      if (userFirebase) {
        setUsuario(userFirebase);
        const docRef = doc(db, 'usuarios', userFirebase.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRol(docSnap.data().rol);
        }
      } else {
        setUsuario(null);
        setRol(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {usuario ? (
        rol !== null ? (
          rol === 'admin' ? (
            <HomeAdmin correousuario={usuario.email} />
          ) : (
            <HomeCliente correousuario={usuario.email} />
          )
        ) : (
          <div>Loading...</div>
        )
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
