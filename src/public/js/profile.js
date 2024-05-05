const userId = document.getElementById('userId').value;

document.getElementById('logoutBtn').addEventListener('click', async () => {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas cerrar sesión?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        fetch(`/api/jwt/${userId}/logout`, {
            method: 'POST'
        })
        .then(response => {
            window.location.href = '/login';
        })
        .catch(error => {
            console.error('Error al cerrar sesión:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al cerrar sesión. Por favor, intenta de nuevo más tarde.'
            });
        });
    }
});
