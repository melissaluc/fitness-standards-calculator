


export function getEnumFromString<T extends Object>(value: string, enumType: T): T[keyof T] | null{
    if (value === null) {
        return null;
    }
    
    const enumsKeywords = Object.entries(enumType);
    for (const [key, enumValue] of enumsKeywords) {
        if(value === key) {
            return enumValue
        }
    }

    return null
}


