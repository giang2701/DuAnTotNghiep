import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
type RemoveDialogProps = {
    isOpen: boolean;
    onCloseDialog: (confirm: boolean) => void;
    onConfirmDelete: () => void;
};
export default function DialogRemove({
    isOpen,
    onCloseDialog,
    onConfirmDelete,
}: RemoveDialogProps) {
    const handleAgree = () => {
        onCloseDialog(false);
        onConfirmDelete();
    };

    const handleClose = () => {
        onCloseDialog(false);
    };

    return (
        <React.Fragment>
            <Dialog
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title " sx={{ fontSize: "15px" }}>
                    Xóa Sản Phẩm
                </DialogTitle>
                <DialogContent>
                    <DialogContentText
                        id="alert-dialog-description"
                        sx={{ fontSize: "15px" }}
                    >
                        Bạn có chắc chắn muốn xóa sản phẩm này không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} sx={{ fontSize: "12px" }}>
                        Hủy Bỏ
                    </Button>
                    <Button
                        onClick={handleAgree}
                        autoFocus
                        sx={{ fontSize: "12px" }}
                    >
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
