import ACTIONS from "@features/actions"

const boards: Array<[]> = []

const boardsReducer = (state = boards, action: any) => {
    switch(action.type){
        case ACTIONS.GET_BOARDS:
            return action.payload
        default:
            return state
    }
}

export default boardsReducer