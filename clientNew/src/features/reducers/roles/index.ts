import ACTIONS from "@features/actions"

export type RoleListInfo = {
    _id: string
    name: string,
}

export type RoleListState = {
    roles: RoleListInfo[]
}

const roles: RoleListInfo[] = []

const rolesReducer = (state = roles, action: any) => {
    switch(action.type){
        case ACTIONS.GET_ROLES:
            return action.payload
        default:
            return state
    }
}

export default rolesReducer