import React, { useState, useEffect } from 'react';
import styles from './page.module.css'
import { IoCartOutline, IoSearchCircle } from "react-icons/io5";
import { TbEdit } from "react-icons/tb";
import { FaRegTrashCan } from "react-icons/fa6";
import { collection, getFirestore, deleteDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import appFirebase from '@/credenciales';
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
        resumen: '',
        imagen: '',
        precio: '',
    });

    const db = getFirestore(appFirebase);

    useEffect(() => {
        fetchLibros();
    }, []);

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
            resumen: libro.resumen,
            imagen: libro.imagen,
            precio: libro.precio,
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
                resumen: '',
                imagen: '',
                precio: '',
            });
        } catch (error) {
            console.error('Error updating libro:', error);
        }
    };

    return (
        <div className="App">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 style={{fontFamily:'monospace', color:'white', marginBlock: '20px'}}>Libros</h1>
                <div style={{ margin: '44px', display: 'flex', flexDirection: 'row', backgroundColor: 'white', borderRadius: '20px' }}>
                    <IoSearchCircle style={{ fontSize: '30px', color: 'rgb(11, 11, 11)' }} />
                    <input
                        type="text"
                        placeholder="Buscar por título..."
                        value={filtroTitulo}
                        onChange={(e) => setFiltroTitulo(e.target.value)}
                        style={{ paddingLeft: '20px', border: 'none', borderRadius: '20px', width: '70vh' }} />
                </div>
                <ul className={styles.bookList}>
                    {libros
                        .filter((libro) =>
                            libro.titulo.toLowerCase().includes(filtroTitulo.toLowerCase())
                        )
                        .map((libro) => (
                            <li key={libro.id} className={styles.bookItem}>
                                {editandoLibro === libro.id ? (
                                    <div className={styles.EditBook}>
                                        <p style={{ color: 'rgb(122, 122, 122)', marginBottom: '0', marginTop: '10px', fontSize: '12px' }}>URL de imagen:</p>
                                        <input
                                            type="text"
                                            value={nuevoLibro.imagen}
                                            onChange={(e) => setNuevoLibro({ ...nuevoLibro, imagen: e.target.value })}
                                            placeholder="URL de imagen"
                                        />
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'left', width: '100%' }}>
                                            <p style={{ color: 'rgb(122, 122, 122)', marginBottom: '0', marginTop: '10px', fontSize: '12px' }}>Título:</p>
                                            <input
                                                type="text"
                                                value={nuevoLibro.titulo}
                                                onChange={(e) => setNuevoLibro({ ...nuevoLibro, titulo: e.target.value })}
                                                placeholder="Título" />

                                            <p style={{ color: 'rgb(122, 122, 122)', marginBottom: '0', marginTop: '10px', fontSize: '12px' }}>Autor:</p>
                                            <input
                                                type="text"
                                                value={nuevoLibro.autor}
                                                onChange={(e) => setNuevoLibro({ ...nuevoLibro, autor: e.target.value })}
                                                placeholder="Autor" />

                                            <div style={{ display: 'flex', flexDirection: 'row', marginTop: '5px' }}>
                                                <div style={{ width: '65%' }}>
                                                    <p style={{ color: 'rgb(122, 122, 122)', marginBottom: '0', marginTop: '10px', fontSize: '12px' }}>Resumen:</p>
                                                    <textarea
                                                        type="text"
                                                        value={nuevoLibro.resumen}
                                                        onChange={(e) => setNuevoLibro({ ...nuevoLibro, resumen: e.target.value })}
                                                        placeholder="Resumen"
                                                        style={{ height: '90%' }} />
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '15px', width: '12vh' }}>
                                                    <p style={{ color: 'rgb(122, 122, 122)', marginBottom: '0', marginTop: '10px', fontSize: '12px' }}>Género:</p>
                                                    <input
                                                        type="text"
                                                        value={nuevoLibro.genero}
                                                        onChange={(e) => setNuevoLibro({ ...nuevoLibro, genero: e.target.value })}
                                                        placeholder="Género"
                                                    />
                                                    <p style={{ color: 'rgb(122, 122, 122)', marginBottom: '0', marginTop: '10px', fontSize: '12px' }}>Fecha de publicación:</p>
                                                    <input
                                                        type="text"
                                                        value={nuevoLibro.fechaPublicacion}
                                                        onChange={(e) => setNuevoLibro({ ...nuevoLibro, fechaPublicacion: e.target.value })}
                                                        placeholder="Fecha de Publicación"
                                                    />
                                                </div>
                                            </div>
                                            <p style={{ color: 'rgb(122, 122, 122)', marginBottom: '0', marginTop: '10px', fontSize: '12px' }}>Precio:</p>
                                            <input
                                                type="text"
                                                value={nuevoLibro.precio}
                                                onChange={(e) => setNuevoLibro({ ...nuevoLibro, precio: e.target.value })}
                                                placeholder="Precio"
                                            />
                                            <p style={{ color: 'rgb(122, 122, 122)', marginBottom: '0', marginTop: '10px', fontSize: '12px' }}>ISBN:</p>
                                            <input
                                                type="text"
                                                value={nuevoLibro.ISBN}
                                                onChange={(e) => setNuevoLibro({ ...nuevoLibro, ISBN: e.target.value })}
                                                placeholder="ISBN"
                                            />
                                        </div>
                                        <button className={styles.btnlibro1} onClick={() => saveLibro(libro.id)}>Guardar</button>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <img src={libro.imagen} className={styles.imagenlibro} />
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'left', width: '100%' }}>
                                            <p className={styles.librotitulo}>{libro.titulo}</p>
                                            <p className={styles.librotexto1}>{libro.autor}</p>
                                            <div style={{ display: 'flex', flexDirection: 'row', marginTop: '5px' }}>
                                                <div style={{ width: '65%' }}>
                                                    <p className={styles.librotexto2}>{libro.resumen}</p>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '15px', width: '12vh' }}>
                                                    <p className={styles.librotexto2}>{libro.genero}</p>
                                                    <p className={styles.librotexto2}>{libro.fechaPublicacion}</p>
                                                </div>
                                            </div>
                                            <p className={styles.librotexto1}>${libro.precio}</p>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <button style={{ border: '0', marginRight: '15px' }} onClick={() => editLibro(libro)}><TbEdit style={{ fontSize: '24px', color: 'blue' }} /></button>
                                            <button style={{ border: '0', marginLeft: '15px' }} onClick={() => deleteLibro(libro.id)}><FaRegTrashCan style={{ fontSize: '20px', color: 'red' }} /></button>
                                        </div>
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
