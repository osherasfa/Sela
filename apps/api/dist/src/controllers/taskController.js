import { db } from "../db/index.js";
import { tasks } from "../db/schema.js";
import { eq } from "drizzle-orm";
const updateTask = async (req, res) => {
    const { taskId } = req.params;
    const { columnId, position, title, description } = req.body;
    try {
        const updateData = {};
        if (columnId !== undefined)
            updateData.columnId = columnId;
        if (position !== undefined)
            updateData.position = String(position);
        if (title !== undefined)
            updateData.title = title;
        if (description !== undefined)
            updateData.description = description;
        updateData.updatedAt = new Date();
        const [updatedTask] = await db
            .update(tasks)
            .set(updateData)
            .where(eq(tasks.id, taskId))
            .returning();
        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        return res.status(200).json(updatedTask);
    }
    catch (error) {
        return res.status(500).json({ message: `Error updating task: ${error?.message || error}` });
    }
};
const createTask = async (req, res) => {
    const { columnId, title, description, position } = req.body;
    if (!columnId || !title) {
        return res.status(400).json({ message: "Missing columnId or title" });
    }
    try {
        // Determine position
        let taskPosition = position;
        if (!taskPosition) {
            const existing = await db.select().from(tasks).where(eq(tasks.columnId, columnId));
            taskPosition = String(existing.length + 1);
        }
        const [newTask] = await db
            .insert(tasks)
            .values({
            columnId,
            title,
            description: description || "",
            position: String(taskPosition),
        })
            .returning();
        return res.status(201).json(newTask);
    }
    catch (error) {
        return res.status(500).json({ message: `Error creating task: ${error?.message || error}` });
    }
};
export { updateTask, createTask };
//# sourceMappingURL=taskController.js.map