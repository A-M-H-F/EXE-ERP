// mac address
const macAddressPattern = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
export const isValidMACAddress = (macAddress: any) => macAddressPattern.test(macAddress);

// ip address
const ipAddressPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
export const isValidIPAddress = (ipAddress: any) => ipAddressPattern.test(ipAddress);

// phone numbers
const phoneNumberPattern = /^[0-9+]+$/;
export const isValidPhoneNumber = (phoneNumber: any) => phoneNumberPattern.test(phoneNumber);

// coordinates
const coordinatesPattern = /^-?\d+(\.\d+)?$/;
export const isValidCoordinates = (value: any) => coordinatesPattern.test(value);