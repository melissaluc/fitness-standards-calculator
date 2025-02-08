export function getEnumFromString(value, enumType, isNull = false) {
    if (isNull) {
        return null;
    }
    const enumsKeywords = Object.entries(enumType);
    for (const [key, enumValue] of enumsKeywords) {
        if (value === key) {
            return enumValue;
        }
    }
    throw new Error(`Invalid enum value: ${value}`);
}
