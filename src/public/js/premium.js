document.addEventListener('DOMContentLoaded', () => {
    const premiumForm = document.getElementById('premiumForm');
    const uid = document.getElementById('userId').value; // Obtener uid del URL
    console.log(uid);

    premiumForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(premiumForm);
        for (const pair of formData.entries()) {
            const [name, value] = pair;
            if (value instanceof File) {
                console.log(`${name}:`);
                console.log(`  name: ${value.name}`);
                console.log(`  size: ${value.size}`);
                console.log(`  type: ${value.type}`);
            } else {
                console.log(pair[0] + ', ' + pair[1]);
            }
        }

        try {
            const response = await fetch(`/api/users/premium/${uid}`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error al actualizar a premium');
            }

            const data = await response.json();
            console.log(data);
            console.log(data.message);
            // Redireccionar o mostrar mensaje de éxito
        } catch (error) {
            console.error('Error:', error);
            // Manejar error
        }
    });
});
