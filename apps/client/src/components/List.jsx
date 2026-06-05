import Task from "./Task";

const List = ({ title, tasks, moveTask }) => {
    return (
        <div className="list" key={title}>
            <h3>{title}</h3>
            {tasks.map(task => <Task key={task.taskId} task={task} moveTask={moveTask} currList={title} />)}
        </div>
    );
};

export default List;