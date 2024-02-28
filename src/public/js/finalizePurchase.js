// En el archivo finalizePurchase.js
const finalizePurchase = async () => {
    try {
        const token = document.cookie.split('; ').find(row => row.startsWith('jwtCookieToken='));
        if (!token) {
            throw new Error('No se encontró el token de autenticación en la cookie');
        }
        const jwtToken = token.split('=')[1];
        
        const totalAmount = parseFloat(document.querySelector('.total').textContent.split(': ')[1]);

        const ticketData = {
            amount: totalAmount
        };

        const response = await fetch('/api/cart/finalizePurchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}` // Usar el token JWT obtenido de la cookie
            },
            body: JSON.stringify(ticketData)
        });

        if (response.ok) {
            const { purchaseId } = await response.json();
            window.location.href = `/finalizePurchase?id=${purchaseId}`; // Redirigir con el ID del ticket
        } else {
            throw new Error('Error al finalizar la compra');
        }
    } catch (error) {
        console.error(error);
        alert('Ocurrió un error al finalizar la compra');
    }
};

const finalizePurchaseButton = document.getElementById('btn-finish-purchase');
finalizePurchaseButton.addEventListener('click', finalizePurchase);
