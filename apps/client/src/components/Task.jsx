import { useRef } from "react";

const Task = ({ task, moveTask, currList }) => {
    const coords = useRef({ newX: 0, newY: 0, startX: 0, startY: 0 });
    const { taskId, taskTitle, taskDescription, subTasks, taskTags } = task;


    const handleMouseDown = (e) => {
        // console.log('Mouse Down');
        coords.current = { ...coords.current, startX: e.clientX, startY: e.clientY };

        // document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    // const handleMouseMove = (e) => {
    //     console.log('Mouse Move');

    // }

    const handleMouseUp = (e) => {
        // document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        const x = e.clientX, y = e.clientY;
        // console.log('Mouse Up', x, y);

        const element = document.elementFromPoint(x, y).closest('.list')

        if (!element) return

        const toList = element.firstElementChild.textContent;

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