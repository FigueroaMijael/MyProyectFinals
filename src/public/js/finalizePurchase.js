const finalizePurchase = async () => {
    try {
        const totalAmount = parseFloat(document.querySelector('.total').textContent.split(': ')[1]);

        const ticketData = {
            amount: totalAmount
        };

        const response = await fetch('/api/cart/finalizePurchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ticketData)
        });

        if (response.ok) {
            const { purchaseId } = await response.json();
            window.location.href = `/finalizePurchase/${purchaseId}`;
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

