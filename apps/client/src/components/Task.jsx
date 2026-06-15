import { useRef } from "react";

const Task = ({ task, moveTask, currList }) => {
    const coords = useRef({ mouseX: 0, mouseY: 0, elemX: 0, elemY: 0 });
    const taskRef = useRef(null);
    const { taskId, taskTitle, taskDescription, subTasks, taskTags } = task;


    const handleMouseDown = (e) => {
        taskRef.current = e.target.closest('.task');
        if (!taskRef.current) return;

        const { top, left } = taskRef.current.getBoundingClientRect();
        coords.current = { mouseX: e.clientX, mouseY: e.clientY, elemX: left, elemY: top };

        taskRef.current.style.position = 'fixed';
        taskRef.current.style.opacity = '0.5';
        taskRef.current.style.border = '4px dashed #ccc';

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    const handleMouseMove = ({ clientX: x, clientY: y }) => {
        const { mouseX, mouseY, elemX, elemY } = coords.current;

        taskRef.current.style.top = `${elemY + y - mouseY}px`;
        taskRef.current.style.left = `${elemX + x - mouseX}px`;
    }

    const handleMouseUp = ({ clientX: x, clientY: y }) => {
        const toList = document.elementFromPoint(x, y).closest('.list').firstElementChild.textContent
        if (!toList) return

        taskRef.current.style.opacity = '1';
        taskRef.current.style.border = '1px solid #ccc';
        taskRef.current = null;

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        moveTask(taskId, currList, toList);
    }

    return (
        <div className="task" onMouseDown={handleMouseDown}>

            <h3>{taskTitle}</h3>
            <p>{taskDescription}</p>
            <ul>{subTasks.map((subTask, index) => <li key={index}>{subTask}</li>)}</ul>
            <div>
                {taskTags.map((tag, index) =>
                    <span style={{ margin: '4px' }} key={index}>#{tag}</span>
                )}
            </div>

        </div>
    );
};

export default Task;