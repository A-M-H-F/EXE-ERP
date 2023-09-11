import ACTIONS from "@features/actions"
import { User } from "@utils/types"

export type UsersListState = {
    usersList: User[]
}

const usersList: User[] = []

const allUsersReducer = (state = usersList, action: any) => {
    switch(action.type){
        case ACTIONS.GET_ALL_USERS:
            return action.payload
        default:
            return state
    }
}

export default allUsersReducer