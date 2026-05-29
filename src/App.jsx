import { useState, useEffect } from 'react';
import PersonaList from './components/PersonaList';
import PersonaForm from './components/PersonaForm';
import alerta from './utils/alerta';
import { getPersonas, createPersona, updatePersona, deletePersona } from './services/api';

function App() {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPersona, setEditingPersona] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const cargarPersonas = async () => {
    try {
      setLoading(true);
      const data = await getPersonas();
      setPersonas(data);
    } catch (err) {
      alerta.error('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPersonas();
  }, []);

  const handleNuevo = () => {
    setEditingPersona(null);
    setShowForm(true);
  };

  const handleEditar = (persona) => {
    setEditingPersona(persona);
    setShowForm(true);
  };

  const handleEliminar = async (id) => {
    const resultado = await alerta.confirmarEliminar();
    if (!resultado.isConfirmed) return;
    try {
      await deletePersona(id);
      await cargarPersonas();
      alerta.exito('Persona eliminada correctamente.');
    } catch (err) {
      alerta.error(err.message);
    }
  };

  const handleSubmit = async (data) => {
    if (editingPersona) {
      await updatePersona(editingPersona.id, data);
      alerta.exito('Persona actualizada correctamente.');
    } else {
      await createPersona(data);
      alerta.exito('Persona creada correctamente.');
    }
    setShowForm(false);
    setEditingPersona(null);
    await cargarPersonas();
  };

  const handleCancelar = () => {
    setShowForm(false);
    setEditingPersona(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Gestión de Personas</h1>
        <p className="app-subtitulo">API CRUD — Tecsup</p>
      </header>

      <main className="app-main">
        {showForm ? (
          <PersonaForm
            editingPersona={editingPersona}
            onSubmit={handleSubmit}
            onCancelar={handleCancelar}
          />
        ) : (
          <>
            <div className="barra-herramientas">
              <h2 className="conteo">
                {loading ? 'Cargando...' : `${personas.length} persona(s) registrada(s)`}
              </h2>
              <button className="btn btn-primario" onClick={handleNuevo}>
                + Nueva persona
              </button>
            </div>
            <PersonaList
              personas={personas}
              loading={loading}
              onEditar={handleEditar}
              onEliminar={handleEliminar}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
