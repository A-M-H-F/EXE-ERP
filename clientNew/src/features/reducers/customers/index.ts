import ACTIONS from "@features/actions"

interface CustomerUser {
    _id: string;
    name: string
}

interface CustomerService {
    service: string;
    _id: string;
}

interface CustomerAddress {
    city: string;
    zone: string;
    street: string;
    building: string;
    floor: string;
    apartment: string;
    buildingImage?: string;
}

interface CustomerCoordinates {
    latitude: string;
    longitude: string;
}

export interface Customer {
    _id: string;
    fullName: string;
    arabicName: string;
    service?: CustomerService;
    accountName: string;
    status: string;
    moreInfo?: string;
    phoneNumber: string;
    additionalPhoneNumbers?: string[];
    coordinates: CustomerCoordinates;
    macAddress: string;
    ipAddress: string;
    subscriptionDate: Date;
    address: CustomerAddress;
    updatedAt?: string;
    createdAt?: string;
    createdBy?: CustomerUser;
    updatedBy?: CustomerUser;
}

export type CustomerListState = {
    customersList: Customer[]
}

const customersList: CustomerListState[] = []

const customersReducer = (state = customersList, action: any) => {
    switch(action.type){
        case ACTIONS.GET_ALL_CUSTOMERS:
            return action.payload
        default:
            return state
    }
}

export default customersReducer