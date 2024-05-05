const resetPasswordForm = document.getElementById('resetPasswordForm');

resetPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(resetPasswordForm);
    const token = formData.get('token');
    const email = formData.get('email');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');

    if (newPassword !== confirmPassword) {
        console.error('Las contraseñas no coinciden');
        return;
    }

    try {
        const response = await fetch('/api/jwt/resetPassword', {
            method: 'PUT',
            body: JSON.stringify({ token, email, newPassword }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    
        if (response.status === 200) {
            const result = await response.json();
            window.location.replace('/login');
        } else if (response.status === 400) {
            const error = await response.json();
            console.error(error.error);
+            swal.fire({
                icon: 'error',
                title: 'Token inválido',
                text: error.message
            }).then(() => {
                window.location.href = '/searchUser';
            });
        } else {
            const error = await response.json();
            console.error(error);
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
    }
    
});
