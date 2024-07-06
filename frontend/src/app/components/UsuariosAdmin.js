import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, getFirestore, doc, deleteDoc } from 'firebase/firestore';
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
  }, []);

  const borrarusuario = async (userId) => {
    try {
      // Llamar al backend para eliminar el usuario
      const response = await fetch(`http://localhost:5000/usuarios/${userId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        // Actualizar el estado local
        setUsuarios(usuarios.filter((usuario) => usuario.id !== userId));
        console.log('Usuario eliminado exitosamente!');
  
        // Eliminar el documento de Firestore
        await deleteDoc(doc(db, 'usuarios', userId)); // Reemplaza 'usuarios' con la colección donde se almacenan los datos del usuario
      } else {
        const data = await response.json();
        console.error('Error al eliminar usuario:', data.message);
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  return (
    <div className="App">
      <h1>Gestión de Usuarios</h1>
      <ul>
        {usuarios.map((usuario) => (
          <li key={usuario.id}>
            <strong>{usuario.nombre}</strong> ({usuario.email})
            <button onClick={() => borrarusuario(usuario.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsuariosAdmin;
