const path = require('path');
const fs = require('fs').promises;
require("dotenv").config();

async function deleteImage(imageUrl) {
    try {
      // Extract the path after the domain and /public/ segment
      const publicPath = imageUrl.split(`${process.env.APP_URL}/public/`)[1];
      
      if (!publicPath) {
        return { flag: false, message: 'Invalid image URL format' };
      }
  
      // Construct server file path
      const serverFilePath = path.resolve(
        __dirname, 
        `../public/${publicPath}`
      );
  
      // Check if file exists
      try {
        await fs.access(serverFilePath);
      } catch (error) {
        return { flag: false, message: 'Image file does not exist' };
      }
  
      // Delete the file
      await fs.unlink(serverFilePath);
      
      return { flag: true, message: 'Image deleted successfully' };
    } catch (error) {
      console.error('Error deleting image:', error.message);
      return { 
        flag: false, 
        message: 'Error deleting image',
        error: error.message
      };
    }
}

module.exports = deleteImage;