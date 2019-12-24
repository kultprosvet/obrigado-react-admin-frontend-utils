"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function gqlGetMethod(typName, introspectionResults) {
    let t = null;
    //console.log('gqlGetMethod', typName, introspectionResults)
    for (let type of introspectionResults.queries) {
        if (type.name === typName) {
            t = type;
            break;
        }
    }
    if (t) {
        for (const arg of t.args) {
            t.args[arg.name] = arg;
        }
    }
    return t;
}
exports.gqlGetMethod = gqlGetMethod;
function gqlGetType(typName, introspectionResults) {
    for (let type of introspectionResults.types) {
        if (type.name === typName) {
            return type;
        }
    }
    return null;
}
exports.gqlGetType = gqlGetType;
function gqlGetFieldList(typName, introspectionResults, depth = 2) {
    //console.log('gqlGetFieldList', introspectionResults,typName, depth)
    for (let type of introspectionResults.types) {
        if (type.name === typName) {
            let fields = type.fields.map((item) => {
                let typeInfo = getFieldTypeAndName(item.type);
                //console.log('FIELD', typName, item, typeInfo, depth)
                if (depth == 1 &&
                    (typeInfo.type === 'OBJECT' ||
                        typeInfo.itemType === 'OBJECT'))
                    return '';
                if (typeInfo.type === 'LIST' &&
                    typeInfo.itemType === 'OBJECT') {
                    return `${item.name} {${gqlGetFieldList(typeInfo.typeName, introspectionResults, depth - 1)}}`;
                }
                else if (typeInfo.type === 'OBJECT') {
                    return `${item.name} {${gqlGetFieldList(typeInfo.typeName, introspectionResults, depth - 1)}}`;
                }
                else {
                    return item.name;
                }
            });
            return fields.join(',');
        }
    }
    return '';
}
exports.gqlGetFieldList = gqlGetFieldList;
function getFieldTypeAndName(type) {
    if (type.kind === 'NON_NULL') {
        return getFieldTypeAndName(type.ofType);
    }
    if (type.kind === 'LIST') {
        let types = getFieldTypeAndName(type.ofType);
        return {
            type: 'LIST',
            itemType: types.type,
            typeName: types.typeName,
        };
    }
    if (type.kind === 'OBJECT') {
        return {
            type: 'OBJECT',
            itemType: 'OBJECT',
            typeName: type.name,
        };
    }
    if (type.kind === 'INPUT_OBJECT') {
        return {
            type: 'OBJECT',
            itemType: 'OBJECT',
            typeName: type.name,
        };
    }
    return {
        type: 'SCALAR',
        itemType: 'SCALAR',
        typeName: type.name,
    };
}
exports.getFieldTypeAndName = getFieldTypeAndName;
function getDataParamName(methodName, introspectionResults) {
    let method = gqlGetMethod(methodName, introspectionResults);
    return method.args.data.type.ofType.name;
}
exports.getDataParamName = getDataParamName;
//# sourceMappingURL=introspectionUtils.js.map