import Swal from 'sweetalert2';

const Modal = Swal.mixin({
  confirmButtonColor: '#3a86ff',
  timer: 2500,
  timerProgressBar: true,
});

const alerta = {
  exito: (texto) =>
    Modal.fire({ icon: 'success', title: texto }),

  error: (texto) =>
    Modal.fire({ icon: 'error', title: 'Ocurrió un error', text: texto }),

  aviso: (texto) =>
    Modal.fire({ icon: 'warning', title: 'Atención', text: texto }),

  confirmarEliminar: () =>
    Swal.fire({
      title: '¿Eliminar persona?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e63946',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }),
};

export default alerta;
