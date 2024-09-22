import React from "react";

type PropsContent = {
    content: string | undefined;
};

const ContentDisplay = ({ content }: PropsContent) => {
    return (
        <div
            className="quill-content"
            dangerouslySetInnerHTML={content ? { __html: content } : undefined} // Hiển thị HTML nội dung
        />
    );
};

export default ContentDisplay;
