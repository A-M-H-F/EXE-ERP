import ACTIONS from "@features/actions"
import { User } from "@utils/types"

export type UsersSelectionListState = {
    usersSelection: User[]
}

const usersSelection: User[] = []

const usersSelectionReducer = (state = usersSelection, action: any) => {
    switch(action.type){
        case ACTIONS.GET_USERS_SELECTION:
            return action.payload
        default:
            return state
    }
}

export default usersSelectionReducer