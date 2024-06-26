'use client'
import React, { useState, useEffect } from 'react'
import appFirebase from '@/credenciales'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

const auth = getAuth(appFirebase)
const db = getFirestore(appFirebase)

import Login from './components/Login'
import HomeCliente from './components/HomeCliente'
import HomeAdmin from './components/HomeAdmin'

function App() {
  const [usuario, setUsuario] = useState(null)
  const [rol, setRol] = useState(null)

  useEffect(() => {
    const unsuscribe = onAuthStateChanged(auth, async (usuarioFirebase) => {
      if (usuarioFirebase) {
        setUsuario(usuarioFirebase)
        const docRef = doc(db, "usuarios", usuarioFirebase.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRol(docSnap.data().rol);
        }
      } else {
        setUsuario(null)
        setRol(null)
      }
    })

    return () => unsuscribe()
  }, [])

  if (usuario && rol === null) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {usuario ? (
        rol === 'admin' ? <HomeAdmin correousuario={usuario.email} /> : <HomeCliente correousuario={usuario.email} />
      ) : (
        <Login />
      )}
    </div>
  )
}

export default App
