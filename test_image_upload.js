const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testUpload() {
    try {
        // Create a dummy file
        const filePath = path.join(__dirname, 'test_image.txt');
        fs.writeFileSync(filePath, 'This is a dummy image file content.');

        const formData = new FormData();
        formData.append('title', 'Test Image Upload Post');
        formData.append('content', 'This is a post with an image uploaded via API test.');
        formData.append('author', 'api_tester');
        formData.append('community', 'general');
        // 'image/png' contentType to pass multer filter
        formData.append('image', fs.createReadStream(filePath), { 
            filename: 'test_image.png', 
            contentType: 'image/png' 
        });

        console.log('Sending request to http://localhost:3000/api/posts ...');
        const response = await axios.post('http://localhost:3000/api/posts', formData, {
            headers: formData.getHeaders()
        });

        console.log('Response Status:', response.status);
        console.log('Response Data:', response.data);

        if (response.data.success && response.data.data.image_url) {
            console.log('✅ Upload successful! Image URL:', response.data.data.image_url);
        } else {
            console.log('❌ Upload failed or no image URL returned.');
        }

        // Clean up dummy file
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

    } catch (error) {
        console.error('❌ Error during upload test:', error.response ? error.response.data : error.message);
        // Clean up dummy file on error too
        const filePath = path.join(__dirname, 'test_image.txt');
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
}

testUpload();
