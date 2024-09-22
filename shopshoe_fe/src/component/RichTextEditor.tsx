import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
type TypeRichTextEditor = {
    value: string;
    onChange: (value: string) => void;
};
const RichTextEditor = ({ value, onChange }: TypeRichTextEditor) => {
    return (
        <ReactQuill
            theme="snow"
            value={value}
            onChange={onChange} // Gọi hàm onChange từ props để cập nhật giá trị bên ngoài
            className="quill__description"
        />
    );
};

export default RichTextEditor;
