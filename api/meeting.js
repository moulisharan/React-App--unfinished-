const fetch = require('node-fetch');

const API_KEY = 'shuffle_default_secret';
// const SHUFFLE_URL = "http://localhost:3000/api/v1/meeting";
const SHUFFLE_URL = 'https://mirotalk.up.railway.app/api/v1/meeting';

function getResponse() {
    return fetch(SHUFFLE_URL, {
        method: 'POST',
        headers: {
            authorization: API_KEY,
            'Content-Type': 'application/json',
        },
    });
}

getResponse().then(async (res) => {
    console.log('Status code:', res.status);
    const data = await res.json();
    console.log('meeting:', data.meeting);
});
