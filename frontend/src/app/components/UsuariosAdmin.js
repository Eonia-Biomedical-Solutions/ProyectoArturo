import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { FaRegTrashCan } from "react-icons/fa6";
import { collection, query, onSnapshot, getFirestore } from 'firebase/firestore';
import appFirebase from '@/credenciales'; // Reemplaza con tu configuración de Firebase

const UsuariosAdmin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const db = getFirestore(appFirebase); // Obtener instancia de Firestore

  useEffect(() => {
    const usuariosRef = collection(db, 'usuarios'); // Referencia a la colección "usuarios"
    const q = query(usuariosRef); // Consulta para obtener todos los documentos
    const unsub = onSnapshot(q, (querySnapshot) => {
      const fetchedUsuarios = querySnapshot.docs.map((doc) => ({
        ...doc.data(), // Extraer datos de cada documento
        id: doc.id, // Añadir ID como una propiedad
      }));
      setUsuarios(fetchedUsuarios);
    });
    return () => unsub(); // Desuscribirse al desmontar el componente
  }, [db]);

  const borrarUsuario = async (userId) => {
    try {
      // Llamar al backend para eliminar el usuario
      const response = await fetch(`http://localhost:5000/usuarios/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Actualizar el estado local
        setUsuarios(usuarios.filter((usuario) => usuario.id !== userId));
        console.log('Usuario eliminado exitosamente!');
      } else {
        const data = await response.json();
        console.error('Error al eliminar usuarioo:', data.message);
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  return (
    <div className="App">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ fontFamily: 'monospace', color: 'white', marginBlock: '20px' }}>Gestión de Usuarios</h1>
        <table style={{ backgroundColor: 'white', borderRadius: '7px' }}>
          <thead className={styles.usuariostabla}>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th style={{ width: '50vh' }}>Email</th>
              <th style={{ width: '25vh' }}>Fecha de Nacimiento</th>
              <th style={{ width: '15vh' }}>Rol</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody className={styles.usuariostabla}>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.nombre}</td>
                <td>{usuario.apellido}</td>
                <td>{usuario.email}</td>
                <td>{usuario.fecha}</td>
                <td>{usuario.rol}</td>
                <td>
                  <button onClick={() => borrarUsuario(usuario.id)} className={styles.btnlibro1}><FaRegTrashCan style={{fontSize: '15px', marginRight: '8px'}}/> Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsuariosAdmin;
