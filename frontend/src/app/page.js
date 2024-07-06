'use client'
import React, { useState, useEffect } from 'react';
import appFirebase from '@/credenciales';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Initialize Firebase Auth and Firestore
const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

// Import child components
import Login from './components/Login';
import HomeCliente from './components/HomeCliente';
import HomeAdmin from './components/HomeAdmin';

function App() {
  // Declare state variables for user and role
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null);

  // useEffect hook to handle authentication state changes
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

  // Render based on user authentication and role
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
          <div>Loading user role...</div>
        )
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
