const axios = require('axios');

async function testRegistration() {
    console.log('📝 Testing Registration API...');
    
    const testUser = {
        name: "Shashi Kapoor",
        email: "nandapiyush3@gmail.com",
        password: "password123",
        phone: "6230036196",
        dob: "2005-02-17"
    };

    try {
        console.log('Sending registration request...');
        const response = await axios.post('http://localhost:5000/api/auth/register', testUser);
        
        console.log('✅ Registration successful!');
        console.log('Response:', response.data);
    } catch (error) {
        console.error('❌ Registration failed:');
        if (error.response) {
            // The request was made and the server responded with a status code
            console.log('Status:', error.response.status);
            console.log('Data:', error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.log('No response received from server');
            console.log('Is the backend server running?');
        } else {
            // Something happened in setting up the request
            console.log('Error:', error.message);
        }
    }
}

testRegistration();