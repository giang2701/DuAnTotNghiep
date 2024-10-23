import { Size } from "../interface/Size";

type State = {
    size: Size[];
};
type Action = {
    type: string;
    payload: any;
};
const sizeReducer = (state: State, action: Action) => {
    switch (action.type) {
        case "GET_SIZE":
            return {
                ...state,
                size: action.payload,
            };
        case "ADD_SIZE":
            return {
                ...state,
                size: [...state.size, action.payload],
            };
        case "REMOVE_SIZE":
            return {
                ...state,
                category: state.size.filter(
                    (size) => size._id !== action.payload
                ),
            };
        default:
            return state;
    }
};
export default sizeReducer;
