import { getExtensionFromUrl } from 'podverse-shared'
import RNFS, { DownloadFileOptions } from 'react-native-fs'
import { downloadCustomFileNameId } from './hash'
import { hasValidNetworkConnection } from './network'

const podverseImagesPath = RNFS.DocumentDirectoryPath + '/podverse_images/'

/*
  Limit attempts to re-download an image that may already be in cache
  to once per user session.
*/
const downloadedImageCache = {} as any

export const deleteImageCache = async () => {
  try {
    const folderExists = await RNFS.exists(podverseImagesPath)
    if (folderExists) {
      await RNFS.unlink(podverseImagesPath)
    }
  } catch (error) {
    console.log('deleteImageCache', error)
  }
}

export const downloadImageFile = async (uri: string) => {
  try {
    if (downloadedImageCache[uri]) return

    const isConnected = await hasValidNetworkConnection()
    if (!isConnected) return

    downloadedImageCache[uri] = true

    const ext = getExtensionFromUrl(uri)
    const folderExists = await RNFS.exists(podverseImagesPath)

    if (!folderExists) {
      await RNFS.mkdir(podverseImagesPath)
    }

    const destination = podverseImagesPath + downloadCustomFileNameId(uri) + ext

    const downloadOptions: DownloadFileOptions = {
      fromUrl: uri.replace('http://', 'https://'),
      toFile: destination
    }

    await RNFS.downloadFile(downloadOptions).promise
  } catch (error) {
    console.log('downloadImageFile error:', error)
  }
}

export const getSavedImageUri = async (uri: string) => {
  let fileExists = false
  const ext = getExtensionFromUrl(uri)
  const filePath = podverseImagesPath + downloadCustomFileNameId(uri) + ext

  try {
    fileExists = await RNFS.exists(filePath)
  } catch (error) {
    console.log('getSavedImageUri error', error)
  }

  if (fileExists) {
    return { exists: true, imageUrl: filePath }
  } else {
    return { exists: false, imageUrl: uri }
  }
}
