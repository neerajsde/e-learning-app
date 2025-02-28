const path = require('path');
const fs = require('fs').promises;

async function deleteVideoHandler(videoUrl) {
  try {
    // Ensure the URL starts with '/private/'
    if (!videoUrl.startsWith('/private/')) {
      return { flag: false, message: 'Invalid video path.' };
    }

    // Define the absolute path to the video file
    const videoPath = path.resolve(__dirname, `../${videoUrl}`);

    // Check if the file exists before deleting
    try {
      await fs.access(videoPath);
    } catch {
      return { flag: false, message: 'Video file not found.' };
    }

    // Delete the file
    await fs.unlink(videoPath);

    return { flag: true, message: 'Video deleted successfully.' };
  } catch (error) {
    console.error('Error deleting video:', error);
    return { flag: false, message: 'Error deleting video' };
  }
}

module.exports = deleteVideoHandler;