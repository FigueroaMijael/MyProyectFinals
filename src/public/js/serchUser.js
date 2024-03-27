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
z
            Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: toast => {
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                }
            }).fire({
                icon: 'success',
                title: 'Correo electrónico enviado correctamente'
            });

        } else {

            Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: toast => {
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                }
            }).fire({
                icon: 'error',
                title: 'Error al enviar el correo electrónico',
                text: error.message
            });
        }

    } catch (error) {

        Swal.fire({
            icon: 'error',
            title: 'Fatal error, internal server',
            text: 'comunicate a este email "ecommersgigabyte@gmail.com" para informar al equipo de desarrollo de este problema y resolverlo lo antes posible. Por el momento volve a intentarlo mas tarde.'
        });
    }
});
