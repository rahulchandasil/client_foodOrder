const axios = require('axios');

async function runTests() {
  const baseURL = 'http://localhost:4000/api';
  const email = `test${Date.now()}@test.com`;
  const password = 'password123';
  let token;
  let user;

  console.log('--- RUNNING TESTS ---');

  try {
    // 1. Register
    const regRes = await axios.post(`${baseURL}/auth/register`, {
      name: 'Test User',
      email,
      password
    });
    console.log('REGISTER: Success');
    if (regRes.data.user.password) {
      console.log('ERROR: Password returned in register response');
    }

    // 2. Login
    const loginRes = await axios.post(`${baseURL}/auth/login`, {
      email,
      password
    });
    console.log('LOGIN: Success');
    if (loginRes.data.user.password) {
      console.log('ERROR: Password returned in login response');
    }
    token = loginRes.data.token;
    if (!token) console.log('ERROR: No token in login response');

    // 3. Authenticated Request
    const cartRes = await axios.get(`${baseURL}/cart`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('AUTHENTICATED REQUEST: Success (Cart fetched)');

    // 4. No Token Request
    try {
      await axios.get(`${baseURL}/cart`);
      console.log('ERROR: Request without token succeeded');
    } catch (err) {
      if (err.response.status === 401) {
        console.log('NO TOKEN: Rejected properly (401)');
      }
    }

    // 5. Invalid Token Request
    try {
      await axios.get(`${baseURL}/cart`, {
        headers: { Authorization: 'Bearer invalidtoken123' }
      });
      console.log('ERROR: Request with invalid token succeeded');
    } catch (err) {
      if (err.response.status === 401) {
        console.log('INVALID TOKEN: Rejected properly (401)');
      }
    }

    console.log('--- ALL TESTS COMPLETED ---');
    process.exit(0);
  } catch (err) {
    console.error('Test Failed:', err.message);
    if (err.response) console.error(err.response.data);
    process.exit(1);
  }
}

runTests();
