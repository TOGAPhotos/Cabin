import exifr from 'exifr' 

export interface ExifData {
    DateTimeOriginal: string
    ExposureTime: number
    FNumber: number
    ISO: number
    LensModel: string
    Model: string
}

export function ExifReader(file: File): Promise<ExifData> {
    if (!file.type.startsWith('image/')) {
      return Promise.reject(new Error('File is not an image.'));
    }
    return new Promise((resolve, reject) => {
      exifr.parse(file).then(
        output => {
          const exifData: ExifData = {
            DateTimeOriginal: output.DateTimeOriginal.toTimeString() ?? '',
            ExposureTime: output.ExposureTime,
            FNumber: output.FNumber,
            ISO: output.ISO,
            LensModel: output.LensModel,
            Model: output.Model
          }
          resolve(exifData)
        }
      ).catch(reject);
    })
}
