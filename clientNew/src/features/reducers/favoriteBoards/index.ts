import ACTIONS from "@features/actions"

const favoriteBoards: Array<[]> = []

const favoriteBoardsReducer = (state = favoriteBoards, action: any) => {
    switch(action.type){
        case ACTIONS.GET_FAVORITE_BOARDS:
            return action.payload
        default:
            return state
    }
}

export default favoriteBoardsReducer