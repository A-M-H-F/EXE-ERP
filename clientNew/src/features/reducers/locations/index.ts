import ACTIONS from "@features/actions"

export interface LocationZoneStreet {
    _id: string;
    name: string;
}

export interface LocationZone {
    _id: string;
    name: string;
    streets: LocationZoneStreet[]
}

export interface Location {
    _id: string;
    city: string;
    status: string;
    zones: LocationZone[],
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

export type LocationsListState = {
    locationsList: Location[]
}

const locationsList: LocationsListState[] = []

const locationsReducer = (state = locationsList, action: any) => {
    switch(action.type){
        case ACTIONS.GET_ALL_LOCATIONS:
            return action.payload
        default:
            return state
    }
}

export default locationsReducer