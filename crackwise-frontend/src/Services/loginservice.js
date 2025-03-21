// loginService.js
import axios from 'axios';

const loginService = async (email, password) => {
  try {
    const response = await axios.post('http://192.168.203.16:5000/auth/login', {
      email,
      password,
    });
    return response; // Returns the response object
  } catch (error) {
    throw new Error('Login failed: ' + error.response?.data?.message || error.message);
  }
};

export default loginService;
