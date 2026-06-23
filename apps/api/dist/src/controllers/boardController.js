import { db } from "../db/index.js";
import { boards, columns, tasks } from "../db/schema.js";
import { eq } from "drizzle-orm";
const getBoard = async (req, res) => {
    const { boardId } = req.params;
    try {
        /** Fetch board and it's columns and tasks */
        const [resBoard] = await db.select().from(boards).where(eq(boards.id, boardId));
        if (!resBoard)
            return res.status(404).json({ message: "Board not found" });
        const resColumns = await db.select({
            id: columns.id,
            boardId: columns.boardId,
            title: columns.title,
            position: columns.position,
        }).from(columns).where(eq(columns.boardId, boardId));
        const resTasks = await db.select({
            id: tasks.id,
            columnId: tasks.columnId,
            title: tasks.title,
            description: tasks.description,
            position: tasks.position,
        }).from(tasks).innerJoin(columns, eq(tasks.columnId, columns.id))
            .where(eq(columns.boardId, boardId));
        /** Joining all together */
        const columnsWithTasks = resColumns.map(col => ({ ...col, tasks: resTasks.filter(task => task.columnId === col.id) }));
        return res.status(200).json({ ...resBoard, columns: columnsWithTasks });
    }
    catch (error) {
        res.status(500).json({ message: `Error fetching board: ${error?.message || error}` });
    }
};
const getBoards = async (req, res) => {
    try {
        const resBoards = await db.select().from(boards);
        return res.status(200).json(resBoards);
    }
    catch (error) {
        res.status(500).json({ message: `Error fetching boards: ${error?.message || error}` });
    }
};
export { getBoard, getBoards };
//# sourceMappingURL=boardController.js.map