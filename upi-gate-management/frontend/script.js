document.getElementById('upiForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const upiId = document.getElementById('upiId').value;
    const amount = document.getElementById('amount').value;

    const res = await fetch('http://localhost:5000/api/transaction/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upiId, amount })
    });

    const data = await res.json();
    document.getElementById('result').innerText = `Status: ${data.status}`;
});
