import ACTIONS from "../../actions"

export type TokenState = {
    token: string
}

const token: string = ''

const tokenReducer = (state = token, action: any) => {
    switch(action.type){
        case ACTIONS.GET_TOKEN:
            return action.payload
        default:
            return state
    }
}

export default tokenReducer