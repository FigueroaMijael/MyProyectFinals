document.addEventListener('DOMContentLoaded', async () => {
    document.querySelectorAll('.updateUserBtn').forEach(button => {
        button.addEventListener('click', async () => {
            const userId = button.dataset.userId;
            try {
                const response = await fetch(`/api/users/${userId}`);
                if (!response.ok) {
                    throw new Error('Error al obtener los datos del usuario');
                }
                const userData = await response.json();
                renderUpdateForm(userData);
            } catch (error) {
                console.error('Error:', error.message);
            }
        });
    });

    document.querySelectorAll('.deleteUserBtn').forEach(button => {
        button.addEventListener('click', async () => {
            const userId = button.dataset.userId;
            if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
                try {
                    const response = await fetch(`/api/users/${userId}`, {
                        method: 'DELETE'
                    });
                    if (!response.ok) {
                        throw new Error('Error al eliminar el usuario');
                    }
                    alert('Usuario eliminado correctamente');
                    // Recarga la página para actualizar la lista de usuarios
                    window.location.reload();
                } catch (error) {
                    console.error('Error:', error.message);
                    alert('Error al eliminar el usuario. Por favor, inténtalo de nuevo más tarde.');
                }
            }
        });
    });
});

function renderUpdateForm(userData) {
    const updateFormContainer = document.getElementById('updateFormContainer');
    const formHTML = `
        <h2>Actualizar Usuario</h2>
        <form id="updateUserForm">
            <label for="role">Role:</label>
            <input type="text" id="role" name="role" value="${userData.role}" required><br>
            <button type="submit">Actualizar</button>
        </form>
    `;
    updateFormContainer.innerHTML = formHTML;

    const updateUserForm = document.getElementById('updateUserForm');
    updateUserForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const updatedUserData = {
            role: updateUserForm.elements.role.value,
        };
        try {
            const response = await fetch(`/api/users/${userData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedUserData)
            });
            if (!response.ok) {
                throw new Error('Error al actualizar el usuario');
            }
            alert('Usuario actualizado correctamente');
            window.location.reload();
        } catch (error) {
            console.error('Error:', error.message);
            alert('Error al actualizar el usuario. Por favor, inténtalo de nuevo más tarde.');
        }
    });
}
