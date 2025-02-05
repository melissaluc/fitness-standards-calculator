export function getEnumFromString(value, enumType) {
    if (value === null) {
        return null;
    }
    const enumsKeywords = Object.entries(enumType);
    for (const [key, enumValue] of enumsKeywords) {
        if (value === key) {
            return enumValue;
        }
    }
    return null;
}
