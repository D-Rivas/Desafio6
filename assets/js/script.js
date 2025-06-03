const ctx = document.getElementById('myChart').getContext('2d');
let chart;

async function fetchData(moneda) {
    try {
        const res = await fetch(`https://mindicador.cl/api/${moneda}`);
        if (!res.ok) throw new Error('Error en la respuesta de la API');
        const data = await res.json();
        return data;
    } catch (error) {
        document.getElementById('error').textContent = 'Error al conectar con la API.';
        throw error;
    }
}

async function convertir() {
    const monto = document.getElementById('monto').value;
    const moneda = document.getElementById('moneda').value;

    if (!monto) {
        alert('Por favor ingresa un monto.');
        return;
    }

    try {
        const indicador = await fetchData(moneda);
        const valorActual = indicador.serie[0].valor;
        const resultado = (monto / valorActual).toFixed(2);

        document.getElementById('resultado').textContent = `Resultado: $${resultado}`;

        const ultimos10 = indicador.serie.slice(0, 10).reverse();
        const labels = ultimos10.map(d => new Date(d.fecha).toLocaleDateString());
        const valores = ultimos10.map(d => d.valor);

        renderChart(labels, valores, moneda);
    } catch (error) {
        console.error('Error en la conversión:', error);
    }
}

function renderChart(labels, valores, moneda) {
    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `Historial últimos 10 días (${moneda.toUpperCase()})`,
                data: valores,
                borderColor: 'red',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: false,
                tension: 0.4,
                pointBackgroundColor: 'white',
                pointBorderColor: 'red',
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 1500,
                easing: 'easeOutBounce'
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white',
                        font: {
                            size: 14
                        }
                    }
                }
            }
        }
    });
}

const montoInput = document.getElementById('monto');
const monedaSelect = document.getElementById('moneda');
const buscarBtn = document.getElementById('buscarBtn');

montoInput.addEventListener('input', validarFormulario);
monedaSelect.addEventListener('change', validarFormulario);

function validarFormulario() {
    if (montoInput.value && monedaSelect.value) {
        buscarBtn.disabled = false;
    } else {
        buscarBtn.disabled = true;
    }
}