"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const introspectionUtils_1 = require("./introspectionUtils");
function buildUploadData(data, inputTypeName, introspectionResults) {
    if (!data)
        return null;
    let type = introspectionUtils_1.gqlGetType(inputTypeName, introspectionResults);
    let out = {};
    for (let f of type.inputFields) {
        // console.log('UPD DATA F', f, 'data', data)
        let fieldInfo = introspectionUtils_1.getFieldTypeAndName(f.type);
        if (fieldInfo.type === 'SCALAR') {
            out[f.name] = data[f.name];
        }
        else if (fieldInfo.typeName === 'FileInput') {
            if (typeof data[f.name] !== 'string') {
                out[f.name] = data[f.name];
            }
        }
        else if (fieldInfo.type === 'OBJECT' && fieldInfo.typeName != 'FileInput') {
            out[f.name] = buildUploadData(data[f.name], f.type.name, introspectionResults);
        }
        else if (fieldInfo.type === 'LIST') {
            if (fieldInfo.itemType !== 'SCALAR') {
                let listItemType = fieldInfo.itemType;
                //  console.log(listItemType, f)
                out[f.name] = [];
                for (let item of data[f.name]) {
                    out[f.name].push(buildUploadData(item, listItemType, introspectionResults));
                }
            }
            else {
                out[f.name] = data[f.name];
            }
        }
    }
    //console.log('UPD DATA', out)
    return out;
}
exports.buildUploadData = buildUploadData;
//# sourceMappingURL=buildUploadData.js.map