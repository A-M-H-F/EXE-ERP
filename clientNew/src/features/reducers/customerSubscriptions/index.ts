import ACTIONS from "@features/actions"

interface User {
    _id: string;
    name: string
}

interface Customer {
    _id: string;
    fullName: string;
    service: Service;
}

interface Service {
    _id: string;
    service: string;
}

interface ServiceHistory {
    _id: string;
    service: Service;
    changeDate: Date;
    changedBy: User;
}

export interface CustomerSubscription {
    _id: string;
    customer: Customer;
    service: Service;
    serviceHistory?: ServiceHistory;
    updatedAt?: string;
    createdAt: string;
    createdBy: User;
    updatedBy?: User;
}

export type CustomersSubscriptionListState = {
    customersSubscriptionList: CustomerSubscription[]
}

const customersSubscriptionList: CustomersSubscriptionListState[] = []

const customersSubscriptionReducer = (state = customersSubscriptionList, action: any) => {
    switch(action.type){
        case ACTIONS.GET_CUSTOMERS_SUBSCRIPTIONS:
            return action.payload
        default:
            return state
    }
}

export default customersSubscriptionReducer