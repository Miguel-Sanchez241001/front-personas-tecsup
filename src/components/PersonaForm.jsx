import { useState, useEffect } from 'react';
import alerta from '../utils/alerta';

const FORM_VACIO = {
  nombre: '',
  apellido: '',
  dni: '',
  email: '',
  telefono: '',
  direccion: '',
  activo: true,
};

const DNI_REGEX = /^\d{8}$/;
const TELEFONO_PERU_REGEX = /^9\d{8}$/;

function validar(form) {
  if (!form.nombre.trim())   return 'El nombre es obligatorio.';
  if (!form.apellido.trim()) return 'El apellido es obligatorio.';
  if (!form.dni.trim())      return 'El DNI es obligatorio.';
  if (!DNI_REGEX.test(form.dni.trim())) return 'El DNI debe tener exactamente 8 dígitos.';
  if (!form.email.trim())    return 'El email es obligatorio.';
  if (!/\S+@\S+\.\S+/.test(form.email)) return 'El email no tiene un formato válido.';
  if (form.telefono.trim() && !TELEFONO_PERU_REGEX.test(form.telefono.trim()))
    return 'El teléfono debe ser un número peruano válido (9 dígitos, empieza con 9).';
  return null;
}

function PersonaForm({ editingPersona, onSubmit, onCancelar }) {
  const [form, setForm] = useState(FORM_VACIO);
  const [camposError, setCamposError] = useState({});
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    setForm(
      editingPersona
        ? {
            nombre:    editingPersona.nombre,
            apellido:  editingPersona.apellido,
            dni:       editingPersona.dni,
            email:     editingPersona.email,
            telefono:  editingPersona.telefono || '',
            direccion: editingPersona.direccion || '',
            activo:    editingPersona.activo,
          }
        : FORM_VACIO
    );
    setCamposError({});
  }, [editingPersona]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (camposError[name]) setCamposError((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const mensajeError = validar(form);
    if (mensajeError) {
      const camposMarcados = {};
      if (mensajeError.includes('nombre'))    camposMarcados.nombre = true;
      if (mensajeError.includes('apellido'))  camposMarcados.apellido = true;
      if (mensajeError.includes('DNI'))       camposMarcados.dni = true;
      if (mensajeError.includes('email'))     camposMarcados.email = true;
      if (mensajeError.includes('teléfono'))  camposMarcados.telefono = true;
      setCamposError(camposMarcados);
      alerta.aviso(mensajeError);
      return;
    }

    setCamposError({});
    setGuardando(true);
    try {
      await onSubmit(form);
    } catch (err) {
      alerta.error(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const campo = (name) => ({
    name,
    value: form[name],
    onChange: handleChange,
    className: camposError[name] ? 'input-error' : undefined,
  });

  return (
    <div className="form-contenedor">
      <h2 className="form-titulo">
        {editingPersona ? `Editar persona #${editingPersona.id}` : 'Nueva persona'}
      </h2>

      <form onSubmit={handleSubmit} className="form" noValidate>
        <div className="form-fila">
          <div className="form-grupo">
            <label htmlFor="nombre">Nombre *</label>
            <input id="nombre" type="text" placeholder="Ej: Ana" {...campo('nombre')} />
          </div>
          <div className="form-grupo">
            <label htmlFor="apellido">Apellido *</label>
            <input id="apellido" type="text" placeholder="Ej: García" {...campo('apellido')} />
          </div>
        </div>

        <div className="form-fila">
          <div className="form-grupo">
            <label htmlFor="dni">DNI *</label>
            <input id="dni" type="text" placeholder="Ej: 12345678" maxLength={8} {...campo('dni')} />
          </div>
          <div className="form-grupo">
            <label htmlFor="email">Email *</label>
            <input id="email" type="email" placeholder="Ej: ana.garcia@gmail.com" {...campo('email')} />
          </div>
        </div>

        <div className="form-fila">
          <div className="form-grupo">
            <label htmlFor="telefono">
              Teléfono
              <span className="label-hint"> (opcional — ej: 987654321)</span>
            </label>
            <input id="telefono" type="tel" placeholder="Ej: 987654321" {...campo('telefono')} />
          </div>
          <div className="form-grupo">
            <label htmlFor="direccion">
              Dirección
              <span className="label-hint"> (opcional)</span>
            </label>
            <input id="direccion" type="text" placeholder="Ej: Av. Arequipa 123, Lima" {...campo('direccion')} />
          </div>
        </div>

        <div className="form-grupo form-grupo-checkbox">
          <label>
            <input
              name="activo"
              type="checkbox"
              checked={form.activo}
              onChange={handleChange}
            />
            Persona activa
          </label>
        </div>

        <div className="form-acciones">
          <button type="button" className="btn btn-secundario" onClick={onCancelar} disabled={guardando}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primario" disabled={guardando}>
            {guardando ? 'Guardando...' : editingPersona ? 'Actualizar' : 'Crear persona'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PersonaForm;
