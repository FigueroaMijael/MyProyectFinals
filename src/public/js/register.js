const form = document.getElementById('registerForm');

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    console.log(data);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    console.log(obj);
    fetch('/api/jwt/register', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type':'application/json'
        }
    }).then(result => {
        if (result.status === 201) {
            alert("Usuario creado con éxito!");
            window.location.replace('/login');
        } else {
            console.log(result);
            alert("No se pudo crear el usuario!");
        }
    }).catch(error => {
        console.error('Error al realizar la solicitud fetch:', error);
        alert("Hubo un error al procesar la solicitud.");
    });
});