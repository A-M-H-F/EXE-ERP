import ACTIONS from "@features/actions"

const usersSelection: Array<[]> = []

const usersSelectionReducer = (state = usersSelection, action: any) => {
    switch(action.type){
        case ACTIONS.GET_USERS_SELECTION:
            return action.payload
        default:
            return state
    }
}

export default usersSelectionReducer