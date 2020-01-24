export function gqlGetMethod(typName: string, introspectionResults: any) {
    let t = null
    //console.log('gqlGetMethod', typName, introspectionResults)
    for (let type of introspectionResults.queries) {
        if (type.name === typName) {
            t = type
            break
        }
    }
    if (t) {
        for (const arg of t.args) {
            t.args[arg.name] = arg
        }
    }

    return t
}

export function gqlGetType(typName: string, introspectionResults: any) {
    for (let type of introspectionResults.types) {
        if (type.name === typName) {
            return type
        }
    }
    return null
}

export function gqlGetFieldList(
    typName: string,
    introspectionResults: any,
    depth: number = 2,
) {
    //console.log('gqlGetFieldList', introspectionResults,typName, depth)
    for (let type of introspectionResults.types) {
        if (type.name === typName) {
            let fields = type.fields.map((item: any) => {
                let typeInfo = getFieldTypeAndName(item.type)
                //console.log('FIELD', typName, item, typeInfo, depth)
                if (
                    depth == 1 &&
                    (typeInfo.type === 'OBJECT' ||
                        typeInfo.itemType === 'OBJECT')
                )
                    return ''
                if (
                    typeInfo.type === 'LIST' &&
                    typeInfo.itemType === 'OBJECT'
                ) {
                    return `${item.name} {${gqlGetFieldList(
                        typeInfo.typeName,
                        introspectionResults,
                        depth - 1,
                    )}}`
                } else if (typeInfo.type === 'OBJECT') {
                    return `${item.name} {${gqlGetFieldList(
                        typeInfo.typeName,
                        introspectionResults,
                        depth - 1,
                    )}}`
                } else {
                    return item.name
                }
            })
            return fields.join(',')
        }
    }
    return ''
}

export function getFieldTypeAndName(
    type: any,
): { type: string; typeName: string; itemType: string } {
    if (type.kind === 'NON_NULL') {
        return getFieldTypeAndName(type.ofType)
    }
    if (type.kind === 'LIST') {
        let types = getFieldTypeAndName(type.ofType)
        return {
            type: 'LIST',
            itemType: types.type,
            typeName: types.typeName,
        }
    }
    if (type.kind === 'OBJECT') {
        return {
            type: 'OBJECT',
            itemType: 'OBJECT',
            typeName: type.name,
        }
    }
    if (type.kind === 'INPUT_OBJECT') {
        return {
            type: 'OBJECT',
            itemType: 'OBJECT',
            typeName: type.name,
        }
    }
    return {
        type: 'SCALAR',
        itemType: 'SCALAR',
        typeName: type.name,
    }
}
export function getDataParamName(methodName:string,introspectionResults:any):string {
    let method = gqlGetMethod(methodName,introspectionResults)
    return method.args.data.type.ofType.name
}

export function checkForAlias(resourceName:string) {
    const aliasCheck = /(.*)@/;
    if (aliasCheck.test(resourceName)) {
        return aliasCheck.exec(resourceName)[1];
    }
    return resourceName;
}
