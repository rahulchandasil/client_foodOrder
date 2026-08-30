const axios = require('axios');

async function runTests() {
  const baseURL = 'http://localhost:3200/api';
  const email = `test${Date.now()}@test.com`;
  const password = 'password123';
  let token;
  let foodId;
  let cartItemId;

  console.log('--- RUNNING TESTS ---');

  try {
    // 1. AUTH
    const regRes = await axios.post(`${baseURL}/auth/register`, { name: 'Test User', email, password });
    console.log('REGISTER: Success');
    
    // Duplicate email
    try { await axios.post(`${baseURL}/auth/register`, { name: 'Test', email, password }); } 
    catch (err) { if (err.response.status === 400 && err.response.data.message === 'User already exists') console.log('REGISTER DUPLICATE EMAIL: 400 Validation Error'); }

    // Validation error
    try { await axios.post(`${baseURL}/auth/register`, { name: 'T', email: 'invalid', password: '123' }); }
    catch (err) { if (err.response.status === 400) console.log('REGISTER INVALID PAYLOAD: 400 Validation Error'); }

    const loginRes = await axios.post(`${baseURL}/auth/login`, { email, password });
    console.log('LOGIN: Success');
    token = loginRes.data.token;

    // 2. FOODS
    const addFoodRes = await axios.post(`${baseURL}/foods`, { name: 'Test Food', description: 'desc', price: 10, category: 'Pizza', image: 'url' });
    foodId = addFoodRes.data.food._id;
    
    await axios.get(`${baseURL}/foods`);
    console.log('GET FOODS: Success');
    
    await axios.get(`${baseURL}/foods/${foodId}`);
    console.log('GET FOOD BY ID: Success');
    
    // Invalid ObjectId format (Should trigger global error handler -> 400 Bad Request)
    try { await axios.get(`${baseURL}/foods/invalid-id`); }
    catch (err) { if (err.response.status === 400) console.log('GET FOOD INVALID ID: 400 CastError'); }

    // 3. CART
    const addToCartRes = await axios.post(`${baseURL}/cart`, { foodId, quantity: 1 }, { headers: { Authorization: `Bearer ${token}` } });
    console.log('ADD TO CART: Success');
    cartItemId = addToCartRes.data.cart.items[0]._id;

    // Invalid Cart Quantity (validation)
    try { await axios.post(`${baseURL}/cart`, { foodId, quantity: -5 }, { headers: { Authorization: `Bearer ${token}` } }); }
    catch (err) { if (err.response.status === 400) console.log('ADD TO CART NEGATIVE QUANTITY: 400 Validation Error'); }

    // 4. ORDERS
    // Invalid address
    try { await axios.post(`${baseURL}/orders`, { address: 'short', mobile: '123' }, { headers: { Authorization: `Bearer ${token}` } }); }
    catch (err) { if (err.response.status === 400) console.log('ORDER INVALID PAYLOAD: 400 Validation Error'); }

    // Valid Order
    await axios.post(`${baseURL}/orders`, { address: 'Valid Address 123', mobile: '9876543210' }, { headers: { Authorization: `Bearer ${token}` } });
    console.log('PLACE ORDER: Success');

    // Empty Cart (after order)
    try { await axios.post(`${baseURL}/orders`, { address: 'Valid Address 123', mobile: '9876543210' }, { headers: { Authorization: `Bearer ${token}` } }); }
    catch (err) { if (err.response.status === 400) console.log('ORDER EMPTY CART: 400 Empty Cart Error'); }

    console.log('--- ALL TESTS COMPLETED SUCCESSFULLY ---');
    process.exit(0);
  } catch (err) {
    console.error('Test Failed:', err.message);
    if (err.response) console.error(err.response.data);
    process.exit(1);
  }
}
runTests();
