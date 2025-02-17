const path = require('path');
const fs = require('fs').promises;

async function deleteVideoHandler(videoUrl) {
  try {
    // Define the directory and video file path
    const videoPath = path.resolve(__dirname, videoUrl);

    // Check if the file exists
    try {
      await fs.access(videoPath);
    } catch {
      return { flag: false, message: 'Video file not found.' };
    }

    // Delete the video file
    await fs.unlink(videoPath);

    // Return success message
    return { flag: true, message: 'Video deleted successfully.' };
  } catch (error) {
    console.error('Error deleting video:', error);
    return { flag: false, message: 'Error deleting video' };
  }
}

module.exports = deleteVideoHandler;