import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.IMAGE_STORAGE_DB_URL,
  process.env.IMAGE_STORAGE_DB_CONNECTION_KEY
)

const bucketName = 'dbc_elegance_store'

const folders = [
  'store/male/categories/',
  'store/male/products/',
  'store/male/accessories/',
  'store/female/categories/',
  'store/female/products/',
  'store/female/accessories/',
]

class StorageFunctions {

  async uploadFile(file, folderPath) {
    try {
      if (!(file instanceof File)) {
        throw new Error('Invalid file type');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${folderPath}${fileName}`;

      const { data, error } = await supabase
        .storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

      if (error) {
        return { success: false, message:error, path:"" };
      }

      const publicUrl = `${process.env.IMAGE_STORAGE_DB_URL}/storage/v1/object/public/${bucketName}/${filePath}`;

      return {
        success: true,
        path: publicUrl,
      };
    } catch (err) {
      return {
        success: false,
        error: err.message,
      };
    }
  }

  
async deleteFile(folderPath, publicUrl) {
  try {
    const baseUrl = `${process.env.IMAGE_STORAGE_DB_URL}/storage/v1/object/public/${bucketName}/`;

    if (!publicUrl.startsWith(baseUrl)) {
      throw new Error("Invalid public URL");
    }

    const fileName = publicUrl.replace(baseUrl, '').split('/').pop();
    const filePath = `${folderPath}${fileName}`;

    // Check if the file exists
    const { data: existingFile, error: headError } = await supabase
      .storage
      .from(bucketName)
      .list(folderPath);

    if (headError) {
      throw new Error('Failed to list files in the folder');
    }

    const fileExists = existingFile.some(file => file.name === fileName);

    if (!fileExists) {
      return { success: false, message: 'File does not exist' };
    }

    // Proceed to delete the file
    const { error } = await supabase
      .storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: 'File deleted successfully' };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
}




}

export default StorageFunctions;
