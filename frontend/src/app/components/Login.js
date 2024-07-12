import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PiSignInThin, PiSignOutThin } from "react-icons/pi";
import styles from './page.module.css';
import appFirebase from '@/credenciales';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

const Login = () => {
  const [registrando, setRegistrando] = useState(false);
  const [rol, setRol] = useState('cliente');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fecha, setFecha] = useState('');

  const functAutenticacion = async (e) => {
    e.preventDefault();
    const correo = e.target.email.value;
    const contrasena = e.target.password.value;

    if (registrando) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, correo, contrasena);
        const user = userCredential.user;

        await setDoc(doc(db, "usuarios", user.uid), {
          email: correo,
          rol: rol,
          nombre: nombre,
          apellido: apellido,
          fecha: fecha
        });

        console.log("User created and data saved successfully!"); 
      } catch (error) {
        console.error("Error creating user:", error.message); 
        alert('Error al registrar usuario:', error.message); 
      }
    } else {
      try {
        await signInWithEmailAndPassword(auth, correo, contrasena);
        console.log("User signed in successfully!"); 
      } catch (error) {
        alert('Usuario o contraseña incorrectos');
      }
    }
  };

  return (
    <main className={styles.containerlogin}>
      <div className={styles.containerlogin2}>
        <div className='col-md-4'>
          <div className={styles.padre}>
            <div className='card card-body shadow-lg'>
              <img src='/assets/profilepng.png' className={styles.estiloprofile} />
              <form onSubmit={functAutenticacion}>
                <input type='text' placeholder='Ingrese su correo' className={styles.cajatexto} id='email' />
                <input type='password' placeholder='Ingrese su contraseña' className={styles.cajatexto} id='password' />
                {registrando && (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <input type='text' placeholder='Nombre' className={styles.cajatexto} value={nombre} onChange={(e) => setNombre(e.target.value)} />
                      <input type='text' placeholder='Apellido' className={styles.cajatexto} value={apellido} onChange={(e) => setApellido(e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <h4 className={styles.texto2}>Fecha de nacimiento</h4>
                      <input type='date' placeholder='Fecha de Nacimiento' className={styles.cajatexto} value={fecha} onChange={(e) => setFecha(e.target.value)} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <h4 className={styles.texto2}>Rol</h4>
                      <select value={rol} onChange={(e) => setRol(e.target.value)} className={styles.cajatexto}>
                        <option value="cliente">Cliente</option>
                        <option value="admin">Administrador</option>
                      </select>
                      </div>
                    </div>
                  </>
                )}
                <button className={styles.botonregistro}><PiSignInThin style={{fontSize: '25px', marginRight:'8px'}}/> {registrando ? 'Regístrate' : 'Iniciar sesión'}</button>
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
          <div className={styles.contenedorimg}>
            <img src="/assets/bookstorecover.png" className={styles.tamanoimagen} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
