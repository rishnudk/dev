import cloudinary from '../config/cloudinary'
import { ApiError } from '../utils/ApiError'

export const uploadService = {

  async uploadHeroImage(
    buffer: Buffer,
    mimetype: string,
    userId: string
  ): Promise<string> {

    return new Promise((resolve, reject) => {
      // Upload stream directly from buffer — no temp files needed
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder:         'dev/portfolios',
          public_id:      `hero_${userId}_${Date.now()}`,
          transformation: [
            { width: 1200, height: 630, crop: 'fill', gravity: 'center' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error || !result) {
            reject(ApiError.internal('Image upload failed'))
          } else {
            resolve(result.secure_url)
          }
        }
      )

      uploadStream.end(buffer)
    })
  },


  async deleteImage(imageUrl: string) {
    try {
      // Extract public_id from the Cloudinary URL
      const parts    = imageUrl.split('/')
      const filename = parts[parts.length - 1].split('.')[0]
      const folder   = parts[parts.length - 2]
      const publicId = `${folder}/${filename}`

      await cloudinary.uploader.destroy(publicId)
    } catch {
      // Non-critical — log but don't throw
      console.error('Failed to delete image from Cloudinary')
    }
  }
}