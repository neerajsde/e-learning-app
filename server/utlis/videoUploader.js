const path = require('path');
const fs = require('fs').promises;

async function videoUploader(folderName, video) {
  try {
    // Validate file type
    const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/mkv'];
    if (!allowedTypes.includes(video.mimetype)) {
      return { flag: false, message: 'Invalid file type. Only videos are allowed.' };
    }

    // Define the directory and create it if necessary
    const uploadDir = path.resolve(__dirname, `../private/${folderName}`);
    await fs.mkdir(uploadDir, { recursive: true });

    // Create a unique file name
    const timestamp = Date.now();
    const ext = path.extname(video.name);
    const videoName = `${timestamp}${ext}`;
    const serverFilePath = path.join(uploadDir, videoName);

    // Save the video
    await fs.writeFile(serverFilePath, video.data);

    // Return the video URL
    return { flag: true, url: `/private/${folderName}/${videoName}` };
  } catch (error) {
    console.error('Error uploading video:', error);
    return { flag: false, message: 'Error uploading video' };
  }
}

module.exports = videoUploader;