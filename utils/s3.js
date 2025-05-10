const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const path = require('path')
const crypto = require('crypto')

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: 'auto', //  Use 'auto' to automatically find the region, as DigitalOcean Spaces uses AWS S3 compatible regions
  endpoint: process.env.AWS_ENDPOINT,
  signatureVersion: 'v4',
})

const uploadToS3 = async (file, key = null, options = {}) => {
  try {
    const fileKey = key || generateKey(file, options.prefix || 'uploads') // Default prefix

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
      Metadata: {
        originalName: file.originalname,
        ...(options.metadata || {}), // Keep any additional metadata
      },
    }

    if (options.contentDisposition) {
      params.ContentDisposition = options.contentDisposition
    }

    await s3.send(new PutObjectCommand(params))
    const publicUrl = `${process.env.AWS_PUBLIC_URL}/${fileKey}`
    return publicUrl
  } catch (err) {
    console.error('Error uploading file to S3:', err)
    throw err // Re-throw the error for handling in the calling function
  }
}

const deleteFromS3 = async (key) => {
  try {
    if (!key) return

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    }

    await s3.send(new DeleteObjectCommand(params))
  } catch (err) {
    console.error('Error deleting file from S3:', err)
    // Don't re-throw, just log (as per original behavior)
  }
}

const uploadMultipleToS3 = async (files, options = {}) => {
  const results = []
  const uploadedFiles = []

  try {
    for (const file of files) {
      const result = await uploadToS3(file, null, options)
      uploadedFiles.push({ url: result, key: getKeyFromUrl(result) })
      results.push(result)
    }
    return results
  } catch (error) {
    // Clean up any uploaded files if there's an error
    await cleanupFiles(uploadedFiles.map((f) => f.key))
    throw error
  }
}

const deleteMultipleFromS3 = async (keys) => {
  const deletePromises = keys.filter(Boolean).map((key) => deleteFromS3(key))
  await Promise.allSettled(deletePromises)
}

const generatePresignedUrl = async (key, expiresIn = 3600) => {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    })

    return await getSignedUrl(s3, command, { expiresIn })
  } catch (error) {
    console.error('Error generating presigned URL:', error)
    throw error
  }
}

// Helper Functions (no JSDoc)
const generateKey = (file, prefix) => {
  const timestamp = Date.now()
  const hash = crypto.randomBytes(4).toString('hex')
  const sanitizedName = path
    .basename(file.originalname, path.extname(file.originalname))
    .replace(/[^a-zA-Z0-9]/g, '-')
    .toLowerCase()

  return `${prefix}/${sanitizedName}-${timestamp}-${hash}${path.extname(file.originalname)}`
}

const getKeyFromUrl = (url) => {
  const baseUrl = process.env.AWS_PUBLIC_URL
  return url.replace(`${baseUrl}/`, '')
}

const cleanupFiles = async (keys) => {
  try {
    await deleteMultipleFromS3(keys)
  } catch (error) {
    console.error('Error cleaning up files:', error)
  }
}

module.exports = {
  uploadToS3,
  deleteFromS3,
  uploadMultipleToS3,
  deleteMultipleFromS3,
  generatePresignedUrl,
}

