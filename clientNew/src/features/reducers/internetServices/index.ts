import ACTIONS from "@features/actions"

interface InternetServiceUser {
    _id: string;
    name: string;
}

interface InternetServiceIsp {
    _id: string;
    name: string;
}

export interface InternetService {
    _id: string;
    name: string;
    isp: InternetServiceIsp;
    status: string;
    service: string;
    cost: number;
    price: number;
    profit: number;
    moreInfo: string;
    updatedAt: string;
    createdAt: string;
    createdBy?: InternetServiceUser;
    updatedBy?: InternetServiceUser;
}

export type InternetServiceListState = {
    internetServicesList: InternetService[]
}

const internetServicesList: InternetServiceListState[] = []

const internetServiceReducer = (state = internetServicesList, action: any) => {
    switch(action.type){
        case ACTIONS.GET_INTERNET_SERVICES:
            return action.payload
        default:
            return state
    }
}

export default internetServiceReducer