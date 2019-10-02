"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// in addUploadFeature.js
/**
 * Convert a `File` object returned by the upload input into a base 64 string.
 * That's not the most optimized way to store images in production, but it's
 * enough to illustrate the idea of data provider decoration.
 */
const convertFileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file.rawFile);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});
/**
 * For posts update only, convert uploaded image in base 64 and attach it to
 * the `picture` sent property, with `src` and `title` attributes.
 */
exports.convertFilesToBase64 = (requestHandler) => (type, resource, params) => __awaiter(void 0, void 0, void 0, function* () {
    if (type === 'UPDATE' || type === 'CREATE') {
        yield iterateDataAndReplaceFiles(params.data);
        console.log('CONVERT', params);
    }
    // for other request types and resources, fall back to the default request handler
    return requestHandler(type, resource, params);
});
function iterateDataAndReplaceFiles(data) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof data !== 'object' || data == null)
            return;
        for (let fld in data) {
            let val = data[fld];
            if (!val)
                continue;
            if (val.rawFile) {
                data[fld] = {
                    body: yield convertFileToBase64(val),
                    file_name: val.rawFile.name,
                };
            }
            if (typeof val === 'object' && val != null) {
                yield iterateDataAndReplaceFiles(val);
            }
            if (Array.isArray(val)) {
                for (let item of val) {
                    yield iterateDataAndReplaceFiles(item);
                }
            }
        }
    });
}
//# sourceMappingURL=upload_file_decorator.js.map