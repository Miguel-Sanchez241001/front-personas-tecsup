function PersonaList({ personas, loading, onEditar, onEliminar }) {
  if (loading) {
    return <div className="estado-carga">Cargando personas...</div>;
  }

  if (personas.length === 0) {
    return (
      <div className="estado-vacio">
        <p>No hay personas registradas. Crea la primera.</p>
      </div>
    );
  }

  return (
    <div className="tabla-wrapper">
      <table className="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>DNI</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {personas.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>{p.apellido}</td>
              <td>{p.dni}</td>
              <td>{p.email}</td>
              <td>{p.telefono || '—'}</td>
              <td>{p.direccion || '—'}</td>
              <td>
                <span className={`badge ${p.activo ? 'badge-activo' : 'badge-inactivo'}`}>
                  {p.activo ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="celda-acciones">
                <button className="btn btn-editar" onClick={() => onEditar(p)}>
                  Editar
                </button>
                <button className="btn btn-eliminar" onClick={() => onEliminar(p.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PersonaList;
