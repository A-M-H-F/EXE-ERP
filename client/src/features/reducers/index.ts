import { combineReducers } from 'redux'
import auth from './auth'
import token from './token'
import roles from './roles'
import boards from './boards'
import favoriteBoards from './favoriteBoards'
import usersSelection from './usersSelection'

export default combineReducers({
    auth,
    token,
    roles,
    boards,
    favoriteBoards,
    usersSelection
})