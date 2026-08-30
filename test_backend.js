import axios from 'axios';

async function testBackend() {
  try {
    const api = axios.create({
      baseURL: 'http://localhost:3200/api', // Assuming backend is on port 3200
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    // Login to get token
    const loginRes = await api.post('/auth/login', { email: 'test_add_cart@example.com', password: 'password123' });
    const token = loginRes.data.token;
    
    // Get foods
    const foodsRes = await api.get('/foods');
    const food = foodsRes.data.foods[0];
    
    // Test the exact request FoodCard sends
    try {
      const cartRes = await api.post('/cart', { foodId: food._id, quantity: 1 }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Success:', cartRes.data);
    } catch (err) {
      console.log('Error data:', err.response?.data);
      console.log('Error status:', err.response?.status);
    }
  } catch (err) {
    console.error('Fatal error:', err.message);
  }
}

testBackend();
