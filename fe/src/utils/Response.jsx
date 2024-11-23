export async function getReply(prompt) {
    return await fetch(`http://127.0.0.1:5000/chatbot/${prompt}`)
        .then(response => response.text())
        .then(data => data)
        .catch(error => {
            console.error('Error:', error);
            return 'Error fetching response';
        });
}