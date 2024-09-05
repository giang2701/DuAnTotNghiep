import { Category } from "../interface/Category";

type State = {
    category: Category[];
};
type Action = {
    type: string;
    payload: any;
};
const categoryReducer = (state: State, action: Action) => {
    switch (action.type) {
        case "GET_CATEGORIES":
            return {
                ...state,
                category: action.payload,
            };
        case "ADD_CATEGORY":
            return {
                ...state,
                category: [...state.category, action.payload],
            };
        case "UPDATE_CATEGORY":
            return {
                ...state,
                category: state.category.map((category) =>
                    category._id === action.payload._id
                        ? action.payload
                        : category
                ),
            };
        case "REMOVE_CATEGORY":
            return {
                ...state,
                category: state.category.filter(
                    (category) => category._id !== action.payload
                ),
            };
        default:
            return state;
    }
};

export default categoryReducer;
