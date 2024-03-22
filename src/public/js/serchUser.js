const searchUserForm = document.getElementById('searchUserForm');

searchUserForm.addEventListener('submit', async e => {
    e.preventDefault();

    const formData = new FormData(searchUserForm);
    const email = formData.get('email');

    try {
        const response = await fetch('/api/email/sendEmailUpdatePassword', {
            method: 'POST',
            body: JSON.stringify({ email }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            const result = await response.json();
            console.log('Correo electrónico enviado:', result);
        } else {
            const error = await response.json();
            console.error('Error al enviar el correo electrónico:', error);
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        alert('Ha ocurrido un error al buscar el usuario.');
    }
});

