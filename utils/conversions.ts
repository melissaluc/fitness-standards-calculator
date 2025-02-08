


export function getEnumFromString<T extends Object>(value: string, enumType: T, isNull: boolean = false): T[keyof T] | null{
    if(isNull){
        return null
    }
    
    const enumsKeywords = Object.entries(enumType);
    for (const [key, enumValue] of enumsKeywords) {
        if(value === key) {
            return enumValue
        }
    }

    throw new Error(`Invalid enum value: ${value}`)
}


