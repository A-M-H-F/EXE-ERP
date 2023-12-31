import { User } from "@utils/types"
import { Role } from "../../../utils/roles/permissionUtils"
import ACTIONS from "../../actions"

type UserState = {
    user: User | any,
    isLogged: boolean,
    role: Role | any
}

export type AuthState = {
    auth: UserState
}

const initialState: UserState = {
    user: undefined,
    isLogged: false,
    role: undefined
}

const authReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case ACTIONS.LOGIN:
            return {
                ...state,
                isLogged: true,
            }
        case ACTIONS.GET_USER:
            return {
                ...state,
                user: action.payload.user,
                role: action.payload.role
            }
        case ACTIONS.LOGOUT:
            return {
                ...state,
                state: initialState
            }
        default:
            return state
    }
}

export default authReducer