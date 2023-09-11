import ACTIONS from "@features/actions"
import { Customer } from ".."

export type ActiveCustomersListState = {
    activeCustomersList: Customer[]
}

const activeCustomersList: ActiveCustomersListState[] = []

const activeCustomersReducer = (state = activeCustomersList, action: any) => {
    switch(action.type){
        case ACTIONS.GET_ACTIVE_CUSTOMERS:
            return action.payload
        default:
            return state
    }
}

export default activeCustomersReducer