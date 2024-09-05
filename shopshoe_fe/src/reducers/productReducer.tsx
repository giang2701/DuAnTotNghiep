import { Product } from "../interface/Products";

type State = {
    products: Product[];
};

type Action = {
    type: string;
    payload: any;
};

const productReducer = (state: State, action: Action) => {
    switch (action.type) {
        case "GET_PRODUCTS":
            return {
                ...state,
                products: action.payload,
            };

        case "ADD_PRODUCT":
            return {
                ...state,
                products: [...state.products, action.payload],
            };

        case "UPDATE_PRODUCT":
            return {
                ...state,
                products: state.products.map((product) =>
                    product._id === action.payload._id
                        ? action.payload
                        : product
                ),
            };

        case "REMOVE_PRODUCT":
            return {
                ...state,
                products: state.products.filter(
                    (product) => product._id !== action.payload
                ),
            };

        default:
            return state;
    }
};

export default productReducer;
