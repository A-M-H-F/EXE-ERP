export const handleCapitalizedValues = (value: string) => {
    const words = value.split(' ');
    const capitalizedValue = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    
    return capitalizedValue
}