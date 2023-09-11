// used
export const checkWhiteSpaces = (value: string) => {
    return value.trim() === '' || value === ' '
}

// used
export const checkLength = (value: string, requiredLength: number) => {
    return value.length <= requiredLength
}

export const checkMaxLength = (value: string, maxLength: number) => {
    return value.length > maxLength
}

// used
export const isLessThan = (value: number, target: number) => {
    return value < target
}

// used
export const isGreaterThan = (value: number, target: number) => {
    return value > target
}

export const isEqualString = (value: string, target: string) => {
    return value === target
}

export const isEqualNumber = (value: number, target: number) => {
    return value === target
}