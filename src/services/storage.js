/**
 * Firebase Storage Service
 * Replaces Base44 file upload operations with Firebase Storage
 */

import { storage } from '../firebase';
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  list
} from 'firebase/storage';

/**
 * Upload a file to Firebase Storage
 * @param {File} file - The file to upload
 * @param {string} path - Storage path (e.g., 'uploads/wellness-intake/')
 * @param {boolean} isPrivate - Whether file should be private (default: false)
 * @returns {Promise<{url: string, path: string}>}
 */
export async function uploadFile(file, path = 'uploads/', isPrivate = false) {
  const timestamp = Date.now();
  const fileName = `${timestamp}-${file.name}`;
  const storagePath = `${path}${fileName}`;
  
  const storageRef = ref(storage, storagePath);
  
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  
  return {
    url,
    path: storagePath,
    name: file.name,
    size: file.size,
    type: file.type
  };
}

/**
 * Upload a private file (authenticated users only)
 */
export async function uploadPrivateFile(file, path = 'private/') {
  return uploadFile(file, path, true);
}

/**
 * Upload file with progress tracking
 * @param {File} file - The file to upload
 * @param {string} path - Storage path
 * @param {Function} onProgress - Progress callback (receives percentage)
 * @returns {Promise<{url: string, path: string}>}
 */
export async function uploadFileWithProgress(file, path = 'uploads/', onProgress) {
  const timestamp = Date.now();
  const fileName = `${timestamp}-${file.name}`;
  const storagePath = `${path}${fileName}`;
  
  const storageRef = ref(storage, storagePath);
  const uploadTask = uploadBytesResumable(storageRef, file);
  
  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(progress);
        }
      },
      (error) => {
        reject(error);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({
          url,
          path: storagePath,
          name: file.name,
          size: file.size,
          type: file.type
        });
      }
    );
  });
}

/**
 * Delete a file from Storage
 * @param {string} filePath - Path to the file in storage
 */
export async function deleteFile(filePath) {
  const fileRef = ref(storage, filePath);
  await deleteObject(fileRef);
  return { deleted: true, path: filePath };
}

/**
 * List files in a directory
 * @param {string} path - Directory path
 * @param {number} maxResults - Maximum number of results (default: 100)
 */
export async function listFiles(path = 'uploads/', maxResults = 100) {
  const listRef = ref(storage, path);
  const result = await list(listRef, { maxResults });
  
  const files = await Promise.all(
    result.items.map(async (itemRef) => {
      const url = await getDownloadURL(itemRef);
      return {
        name: itemRef.name,
        path: itemRef.fullPath,
        url
      };
    })
  );
  
  return files;
}

/**
 * Create a signed URL for temporary access (Firebase Storage doesn't need signed URLs for public files)
 * For private files, use Firebase Authentication to gate access
 */
export async function createFileSignedUrl(filePath) {
  const fileRef = ref(storage, filePath);
  const url = await getDownloadURL(fileRef);
  return url;
}

export default {
  uploadFile,
  uploadPrivateFile,
  uploadFileWithProgress,
  deleteFile,
  listFiles,
  createFileSignedUrl
};
