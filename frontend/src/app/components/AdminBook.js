import React, { useState, useEffect } from 'react';
import { collection, getFirestore, deleteDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import appFirebase from '@/credenciales'; // Replace with your Firebase configuration
import { getAuth } from 'firebase/auth';

const auth = getAuth(appFirebase);

const AdminBook = () => {
    const [libros, setLibros] = useState([]);
    const [filtroTitulo, setFiltroTitulo] = useState('');
    const [editandoLibro, setEditandoLibro] = useState(null);
    const [nuevoLibro, setNuevoLibro] = useState({
        titulo: '',
        autor: '',
        ISBN: '',
        genero: '',
        fechaPublicacion: '',
        resumen: ''
    });

    const db = getFirestore(appFirebase); // Get Firestore instance

    useEffect(() => {
        fetchLibros();
    }, []); // Run only once on component mount

    const fetchLibros = async () => {
        try {
            const librosRef = collection(db, 'libros');
            const querySnapshot = await getDocs(librosRef);
            const fetchedLibros = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setLibros(fetchedLibros);
        } catch (error) {
            console.error('Error fetching libros:', error);
        }
    };

    const deleteLibro = async (id) => {
        try {
            const libroRef = doc(db, 'libros', id);
            await deleteDoc(libroRef);
            setLibros(libros.filter((libro) => libro.id !== id));
        } catch (error) {
            console.error('Error deleting libro:', error);
        }
    };

    const editLibro = (libro) => {
        setEditandoLibro(libro.id);
        setNuevoLibro({
            titulo: libro.titulo,
            autor: libro.autor,
            ISBN: libro.ISBN,
            genero: libro.genero,
            fechaPublicacion: libro.fechaPublicacion,
            resumen: libro.resumen
        });
    };

    const saveLibro = async (id) => {
        try {
            const libroRef = doc(db, 'libros', id);
            await updateDoc(libroRef, nuevoLibro);
            setLibros(libros.map((libro) => (libro.id === id ? { ...libro, ...nuevoLibro } : libro)));
            setEditandoLibro(null);
            setNuevoLibro({
                titulo: '',
                autor: '',
                ISBN: '',
                genero: '',
                fechaPublicacion: '',
                resumen: ''
            });
        } catch (error) {
            console.error('Error updating libro:', error);
        }
    };

    return (
        <div className="App">
            <h1>Libros</h1>
            <div>
                <input
                    type="text"
                    placeholder="Buscar por título..."
                    value={filtroTitulo}
                    onChange={(e) => setFiltroTitulo(e.target.value)}
                />
                <ul>
                    {libros
                        .filter((libro) =>
                            libro.titulo.toLowerCase().includes(filtroTitulo.toLowerCase())
                        )
                        .map((libro) => (
                            <li key={libro.id}>
                                {editandoLibro === libro.id ? (
                                    <div>
                                        <input
                                            type="text"
                                            value={nuevoLibro.titulo}
                                            onChange={(e) => setNuevoLibro({ ...nuevoLibro, titulo: e.target.value })}
                                            placeholder="Título"
                                        />
                                        <input
                                            type="text"
                                            value={nuevoLibro.autor}
                                            onChange={(e) => setNuevoLibro({ ...nuevoLibro, autor: e.target.value })}
                                            placeholder="Autor"
                                        />
                                        <input
                                            type="text"
                                            value={nuevoLibro.ISBN}
                                            onChange={(e) => setNuevoLibro({ ...nuevoLibro, ISBN: e.target.value })}
                                            placeholder="ISBN"
                                        />
                                        <input
                                            type="text"
                                            value={nuevoLibro.genero}
                                            onChange={(e) => setNuevoLibro({ ...nuevoLibro, genero: e.target.value })}
                                            placeholder="Género"
                                        />
                                        <input
                                            type="text"
                                            value={nuevoLibro.fechaPublicacion}
                                            onChange={(e) => setNuevoLibro({ ...nuevoLibro, fechaPublicacion: e.target.value })}
                                            placeholder="Fecha de Publicación"
                                        />
                                        <input
                                            type="text"
                                            value={nuevoLibro.resumen}
                                            onChange={(e) => setNuevoLibro({ ...nuevoLibro, resumen: e.target.value })}
                                            placeholder="Resumen"
                                        />
                                        <button onClick={() => saveLibro(libro.id)}>Guardar</button>
                                    </div>
                                ) : (
                                    <div>
                                        <strong>{libro.titulo}</strong> - {libro.autor} ({libro.fechaPublicacion}) [{libro.genero}] - ISBN: {libro.ISBN} - Resumen: {libro.resumen}
                                        <button onClick={() => editLibro(libro)}>Editar</button>
                                        <button onClick={() => deleteLibro(libro.id)}>Eliminar</button>
                                    </div>
                                )}
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminBook;
