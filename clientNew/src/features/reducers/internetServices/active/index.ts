import ACTIONS from "@features/actions"
import { InternetService } from ".."

export type ActiveInternetServiceListState = {
    activeInternetServicesList: InternetService[]
}

const activeInternetServicesList: ActiveInternetServiceListState[] = []

const activeInternetServiceReducer = (state = activeInternetServicesList, action: any) => {
    switch(action.type){
        case ACTIONS.GET_ACTIVE_INTERNET_SERVICES:
            return action.payload
        default:
            return state
    }
}

export default activeInternetServiceReducer