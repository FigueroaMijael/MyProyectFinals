const form = document.getElementById('changePasswordForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const email = formData.get('email');
    const newPassword = formData.get('newPassword');

    try {
        const response = await fetch('/api/sessions/Updatepassword', {
            method: 'PUT',
            body: JSON.stringify({ email, newPassword }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            const result = await response.json();
            console.log('cambio de contraseña exitoso', result);
            window.location.replace('/users/login')
        } else {
            const error = await response.json();
            console.error(error);
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
    }
});
