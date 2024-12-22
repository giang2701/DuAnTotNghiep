import permissions from "../model/permissions.js";
import User from "../model/User.js";
export const getAllPermissions = async (req, res) => {
    try {
        const Permissions = await permissions.find({});
        res.json(Permissions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching permissions" });
    }
};
export const createPermission = async (req, res) => {
    const { name } = req.body;

    try {
        const permission = new permissions({ name });
        await permission.save();
        res.status(201).json({
            message: "Permission created successfully",
            permission,
        });
    } catch (error) {
        res.status(400).json({ message: "Error creating permission", error });
    }
};
export const UpdatePermission = async (req, res) => {
    const { id } = req.params; // User ID
    const { permissionId } = req.body; // ID của quyền

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Gán quyền
        user.permissions = permissionId; // Gán lại toàn bộ quyền
        await user.save();

        res.json({ message: "Permission assigned successfully", user });
    } catch (error) {
        res.status(400).json({ message: "Error assigning permission", error });
    }
};
export const DeletePermission = async (req, res) => {
    const { id } = req.params; // User ID
    const { permissions } = req.body; // ID của quyền

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Xóa quyền
        user.permissions = user.permissions.filter(
            (p) => !permissions.includes(p.toString())
        );
        await user.save();
        // await user.save();
        res.json({ message: "Permission removed successfully", user });
    } catch (error) {
        res.status(400).json({ message: "Error removing permission", error });
    }
};
