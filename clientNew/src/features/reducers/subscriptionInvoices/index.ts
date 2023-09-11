import ACTIONS from "@features/actions"

interface User {
    _id: string;
    name: string
}

interface Address {
    city: string;
    zone: string;
    street: string;
    building: string;
    floor: string;
    apartment: string;
    buildingImage?: string;
}

interface PrintHistory {
    printedBy: User;
    printDate: Date
}

interface Customer {
    _id: string;
    fullName: string;
    arabicName: string;
    address: Address;
    phoneNumber: string;
    accountName: string;
}

interface ServiceRef {
    _id: string,
    isp: {
        _id: string,
        code: number,
    }
}

interface Service {
    _id: string;
    ref: ServiceRef;
    service: string;
    name: string;
    price: number;
    cost: number;
    ispCode: number;
}

export interface SubscriptionInvoice {
    _id: string;
    customer: Customer;
    service: Service;
    serialNumber: string;
    invoiceMonth: string;
    invoiceDate: Date;
    collector: User;
    paymentStatus: string;
    paymentDate: Date;
    printDate: Date;
    printedBy: User;
    printHistory?: PrintHistory[];
    updatedAt?: string;
    createdAt: string;
    createdBy: User;
    updatedBy?: User;
}

export type SubscriptionInvoicesListState = {
    subscriptionInvoicesList: SubscriptionInvoice[]
}

const subscriptionInvoicesList: SubscriptionInvoicesListState[] = []

const subscriptionInvoicesReducer = (state = subscriptionInvoicesList, action: any) => {
    switch(action.type){
        case ACTIONS.GET_SUBSCRIPTION_INVOICES:
            return action.payload
        default:
            return state
    }
}

export default subscriptionInvoicesReducer