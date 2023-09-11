import ACTIONS from "@features/actions"

interface ISPUser {
    _id: string;
    name: string
}

export interface ISP {
    _id: string;
    name: string;
    status: string;
    code: number;
    contactInfo?: string;
    address: string;
    phoneNumbers: String[];
    updatedAt?: string;
    createdAt?: string;
    createdBy?: ISPUser;
    updatedBy?: ISPUser;
}

export type ISPListState = {
    ispList: ISP[]
}

const ispList: ISPListState[] = []

const ispReducer = (state = ispList, action: any) => {
    switch(action.type){
        case ACTIONS.GET_ALL_ISP:
            return action.payload
        default:
            return state
    }
}

export default ispReducer