import {ObjectLiteral} from "./index";
import {getFieldTypeAndName, gqlGetType} from "./introspectionUtils";

export function buildUploadData(
    data: any,
    inputTypeName: string,
    introspectionResults: any,
) {
    if (!data) return null

    let type = gqlGetType(inputTypeName ,introspectionResults)

    let out: ObjectLiteral = {}
    for (let f of type.inputFields) {
        //console.log('UPD DATA F', f, 'data', data)
        let fieldInfo=getFieldTypeAndName(f.type)

        if (fieldInfo.type==='SCALAR') {
            out[f.name] = data[f.name]
        }else  if(fieldInfo.typeName==='FileInput'){
            //console.log('FINPUT',f.name,data[f.name])
            if (data[f.name]==null){
                out[f.name]={
                    file_name:null,
                    body:null
                }
            }
            else if (typeof data[f.name]==='string'){
                out[f.name]={
                    skip:true
                }
            }
            else if (typeof data[f.name]==='object'){
                out[f.name] = data[f.name]
            }
        }
        else if (fieldInfo.type==='OBJECT' && fieldInfo.typeName!='FileInput') {
            out[f.name] = buildUploadData(
                data[f.name],
                f.type.name,
                introspectionResults,
            )
        } else if (fieldInfo.type==='LIST') {
            if (fieldInfo.itemType!== 'SCALAR' && data[f.name]) {
                let listItemType = fieldInfo.typeName
                //  console.log(listItemType, f)
                out[f.name] = []
                for (let item of data[f.name]) {
                    out[f.name].push(
                        buildUploadData(
                            item,
                            listItemType,
                            introspectionResults,
                        ),
                    )
                }
            } else {
                out[f.name] = data[f.name]
            }
        }
    }
    //console.log('UPD DATA', out)
    return out
}