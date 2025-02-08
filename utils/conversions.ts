


export function getEnumFromString<T extends {}>(value: string, enumType: T, isNull: boolean = false): T[keyof T] | null{
    if(isNull){
        return null
    }
    
    const enumsKeywords = Object.entries(enumType);
    for (const [key, enumValue] of enumsKeywords) {
        if(value.toLowerCase()=== key.toLowerCase()) {
            return enumValue as T[keyof T]
        }
    }

    throw new Error(`Invalid enum value: ${value}`)
}


