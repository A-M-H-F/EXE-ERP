import ACTIONS from "@features/actions"
import { Location } from ".."

export type ActiveLocationsListState = {
    activeLocationsList: Location[]
}

const activeLocationsList: ActiveLocationsListState[] = []

const activeLocationsReducer = (state = activeLocationsList, action: any) => {
    switch(action.type){
        case ACTIONS.GET_ACTIVE_LOCATIONS:
            return action.payload
        default:
            return state
    }
}

export default activeLocationsReducer
