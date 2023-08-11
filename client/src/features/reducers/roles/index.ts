import ACTIONS from "@features/actions"

const roles: Array<[]> = []

const rolesReducer = (state = roles, action: any) => {
    switch(action.type){
        case ACTIONS.GET_ROLES:
            return action.payload
        default:
            return state
    }
}

export default rolesReducer