import { createContext, useEffect, useReducer } from "react";
import instance from "../api";
import { Size } from "../interface/Size";
import sizeReducer from "../reducers/SizeReducer";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
export type SizeContextType = {
    stateSize: { size: Size[] };
    dispatch: React.Dispatch<any>;
    CreateSize: (dataSize: Size) => void;
    DeleteSize: (_id: Size | undefined) => void;
};
export const SizeContext = createContext({} as SizeContextType);
export const SizeProvider = ({ children }: { children: React.ReactNode }) => {
    const [stateSize, dispatch] = useReducer(sizeReducer, { size: [] });
    const nav = useNavigate();
    useEffect(() => {
        (async () => {
            const { data } = await instance.get("/size");
            dispatch({ type: "GET_SIZE", payload: data.data });
        })();
    }, []);
    const CreateSize = async (dataSize: Size) => {
        try {
            const data = await instance.post("/size", dataSize);
            dispatch({ type: "ADD_SIZE", payload: data.data });
            toast.success("Thêm size thành công");
            nav("/admin/size");
            console.log(dataSize);
        } catch (error) {
            toast.error("Thêm size thất bại");
        }
    };
    const DeleteSize = async (_id: Size | undefined) => {
        try {
            await instance.delete(`/size/${_id}`);
            dispatch({ type: "REMOVE_SIZE", payload: _id });
            toast.success("Xóa size thành công");
            window.location.reload();
        } catch (error) {
            toast.error("Xóa size thất bại");
        }
    };
    return (
        <SizeContext.Provider
            value={{ stateSize, dispatch, CreateSize, DeleteSize }}
        >
            {children}
        </SizeContext.Provider>
    );
};
