document.addEventListener('DOMContentLoaded', () => {
    const premiumForm = document.getElementById('premiumForm');
    const uid = document.getElementById('userId').value; 

    premiumForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(premiumForm);

        try {
            const response = await fetch(`/api/users/premium/${uid}`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error al actualizar a premium');
            }

            const data = await response.json();

        } catch (error) {
            console.error('Error:', error);

        }
    });
});
