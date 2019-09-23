// in addUploadFeature.js
/**
 * Convert a `File` object returned by the upload input into a base 64 string.
 * That's not the most optimized way to store images in production, but it's
 * enough to illustrate the idea of data provider decoration.
 */
const convertFileToBase64 = (file: any) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.rawFile)

        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
    })

/**
 * For posts update only, convert uploaded image in base 64 and attach it to
 * the `picture` sent property, with `src` and `title` attributes.
 */
export const convertFilesToBase64 = (requestHandler: any) => async (
    type: string,
    resource: any,
    params: any,
) => {
    if (type === 'UPDATE' || type === 'CREATE') {
        await iterateDataAndReplaceFiles(params.data)
        console.log('CONVERT', params)
    }
    // for other request types and resources, fall back to the default request handler

    return requestHandler(type, resource, params)
}
async function iterateDataAndReplaceFiles(data: any) {
    if (typeof data !== 'object' || data == null) return
    for (let fld in data) {
        let val = data[fld]
        if (!val) continue
        if (val.rawFile) {
            data[fld] = {
                body: await convertFileToBase64(val),
                file_name: val.rawFile.name,
            }
        }
        if (typeof val === 'object' && val != null) {
            await iterateDataAndReplaceFiles(val)
        }
        if (Array.isArray(val)) {
            for (let item of val) {
                await iterateDataAndReplaceFiles(item)
            }
        }
    }
}
