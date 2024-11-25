const fs = require('fs').promises;
const path = require('path');
// Utility function to check if file exists
async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
  }
  
// Utility function for cleaning temp files
async function cleanupTempFile(filePath) {
    try {
        // Check if file exists before attempting deletion
        if (await fileExists(filePath)) {
            await fs.unlink(filePath);
            console.log(`Successfully deleted temp file: ${filePath}`);
            
            // Verify deletion
            const stillExists = await fileExists(filePath);
            if (stillExists) {
                console.error(`Failed to delete file: ${filePath} - file still exists`);
            }
        } else {
            console.log(`No temp file found at: ${filePath}`);
        }
    } catch (error) {
        console.error(`Error during file cleanup: ${filePath}`, error);
        throw error; // Re-throw to handle in the main try-catch
    }
  }
  
  // Utility function to clean entire temp directory
  async function cleanupTempDirectory(dirPath) {
    try {
        const files = await fs.readdir(dirPath);
        const currentTime = Date.now();
        const oneHourAgo = currentTime - (60 * 60 * 1000); // 1 hour in milliseconds
  
        for (const file of files) {
            const filePath = path.join(dirPath, file);
            try {
                const stats = await fs.stat(filePath);
                // Delete files older than 1 hour
                if (stats.ctimeMs < oneHourAgo) {
                    await fs.unlink(filePath);
                    console.log(`Deleted old temp file: ${filePath}`);
                }
            } catch (error) {
                console.error(`Error processing file ${filePath}:`, error);
            }
        }
    } catch (error) {
        console.error('Error cleaning temp directory:', error);
    }
  }
  

module.exports = {
    fileExists,
    cleanupTempFile,
    cleanupTempDirectory
  };