const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');
require("dotenv").config();

async function resizeImage(imgData, width, height, quality = 80) {
  if (width || height) {
    return await sharp(imgData)
      .resize(width, height, { fit: sharp.fit.cover })
      .toFormat('jpeg', { quality })
      .toBuffer();
  } else {
    return imgData;
  }
}

async function imageUploader(folderName, img, setting = null) {
  try {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(img.mimetype)) {
      return { flag: false, message: 'Invalid file type. Only images are allowed.' };
    }

    // Define the directory and create it if necessary
    const uploadDir = path.resolve(__dirname, `../public/${folderName}`);
    await fs.mkdir(uploadDir, { recursive: true });

    // Create a unique file name
    const timestamp = Date.now();
    const ext = path.extname(img.name);
    const imageName = `${timestamp}${ext}`;
    const serverFilePath = path.join(uploadDir, imageName);

    // Resize image
    const resizedImageBuffer = setting ? await resizeImage(img.data, setting.width, setting.height, setting.quality) : img.data; 

    // Save the image
    await fs.writeFile(serverFilePath, resizedImageBuffer);

    // Return the image URL
    return { flag: true, url: `${process.env.APP_URL}/public/${folderName}/${imageName}` };
  } catch (error) {
    console.error('Error uploading image:', error.message);
    return { flag: false, message: 'Error uploading image' };
  }
}

module.exports = imageUploader;