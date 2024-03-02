const finalizePurchase = async () => {
    try {
        const totalAmount = parseFloat(document.querySelector('.total').textContent.split(': ')[1]);

        const ticketData = {
            amount: totalAmount
        };

        // Primer fetch para finalizar la compra y obtener purchaseId
        const response = await fetch('/api/cart/finalizePurchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ticketData)
        });

        if (response.ok) {
            const { purchaseId } = await response.json();
            // Redirecciona a la página de finalización de la compra
            window.location.href = `/finalizePurchase/${purchaseId}`;

            // Segundo fetch para enviar el correo electrónico, pasando purchaseId
            const sendEmail = await fetch('/api/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({purchaseId}, ticketData) // Envía el purchaseId
            });

            if (sendEmail.ok) {
                console.log('Correo electrónico enviado');
            } else {
                throw new Error('Error al enviar el correo electrónico');
            }
        } else {
            throw new Error('Error al finalizar la compra');
        }
    } catch (error) {
        console.error(error);
        alert('Ocurrió un error al finalizar la compra');
    }
};

const finalizePurchaseButton = document.getElementById('btn');
finalizePurchaseButton.addEventListener('click', finalizePurchase);

