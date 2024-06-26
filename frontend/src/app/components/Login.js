'use client'
import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './page.module.css'
import appFirebase from '@/credenciales';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

const Login = () => {
  const [registrando, setRegistrando] = useState(false);
  const [rol, setRol] = useState('cliente');

  const functAutenticacion = async (e) => {
    e.preventDefault();
    const correo = e.target.email.value;
    const contrasena = e.target.password.value;
    if (registrando) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, correo, contrasena);
        const user = userCredential.user;
        // Guardar el rol en Firestore
        await setDoc(doc(db, "usuarios", user.uid), {
          email: correo,
          rol: rol
        });
      } catch (error) {
        alert('Asegúrese de que su contraseña tenga más de 8 caracteres');
      }
    } else {
      try {
        await signInWithEmailAndPassword(auth, correo, contrasena);
      } catch (error) {
        alert('Usuario o contraseña incorrectos');
      }
    }
  };

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-4'>
          <div className={styles.padre}>
            <div className='card card-body shadow-lg'>
              <img src='/assets/profilepng.png' className={styles.estiloprofile} />
              <form onSubmit={functAutenticacion}>
                <input type='text' placeholder='Ingrese su correo' className={styles.cajatexto} id='email' />
                <input type='password' placeholder='Ingrese su contraseña' className={styles.cajatexto} id='password' />
                {registrando && (
                  <select value={rol} onChange={(e) => setRol(e.target.value)} className={styles.cajatexto}>
                    <option value="cliente">Cliente</option>
                    <option value="admin">Administrador</option>
                  </select>
                )}
                <button className={styles.botonregistro}>{registrando ? 'Regístrate' : 'Iniciar sesión'}</button>
              </form>
              <h4 className={styles.texto}>
                {registrando ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
                <button className={styles.botonswitch} onClick={() => setRegistrando(!registrando)}>
                  {registrando ? 'Inicia sesión' : 'Regístrate'}
                </button>
              </h4>
            </div>
          </div>
        </div>
        <div className='col-md-8'>
          <img src="/assets/libros-4.jpg" className={styles.tamanoimagen} />
        </div>
      </div>
    </div>
  );
};

export default Login;
