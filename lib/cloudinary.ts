import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(base64File: string, folder: string): Promise<string> {
  const result = await cloudinary.uploader.upload(base64File, {
    folder:       `gdi/${folder}`,
    quality:      'auto',
    fetch_format: 'auto',
  })
  return result.secure_url
}

export async function uploadBuffer(buffer: Buffer, folder: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `gdi/${folder}`,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) return reject(error)
        resolve(result?.secure_url || '')
      }
    )
    uploadStream.end(buffer)
  })
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}

export default cloudinary
