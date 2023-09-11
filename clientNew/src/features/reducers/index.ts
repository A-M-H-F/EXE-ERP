import { combineReducers } from 'redux'
import auth from './auth'
import token from './token'
import roles from './roles'
import boards from './boards'
import favoriteBoards from './favoriteBoards'
import usersSelection from './usersSelection'
import usersList from './users'
import ispList from './isp'
import internetServicesList from './internetServices'
import activeInternetServicesList from './internetServices/active'
import locationsList from './locations'
import activeLocationsList from './locations/active'
import customersList from './customers'
import activeCustomersList from './customers/active'
import customersSubscriptionList from './customerSubscriptions'
import subscriptionInvoicesList from './subscriptionInvoices'

export default combineReducers({
    auth,
    token,
    roles,
    boards,
    favoriteBoards,
    usersSelection,
    usersList,
    ispList,
    internetServicesList,
    activeInternetServicesList,
    locationsList,
    activeLocationsList,
    customersList,
    activeCustomersList,
    customersSubscriptionList,
    subscriptionInvoicesList,

})