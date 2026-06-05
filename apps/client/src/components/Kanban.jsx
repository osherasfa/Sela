import { useState } from 'react';
import "./CSS/kanban.css";
import List from './List';
import kanbanData from '../assets/kanbanData';


const Kanban = ({ }) => {
    const [lists, setLists] = useState(kanbanData);

    const moveTask = (taskId, fromList, toList) => {
        if (fromList === toList) return;
        const newLists = { ...lists };
        const task = newLists[fromList].find(t => t.taskId === taskId);

        newLists[toList] = [...newLists[toList], task];
        newLists[fromList] = newLists[fromList].filter(task => task.taskId !== taskId);

        setLists(newLists)
    }

    return (
        <div className='kanban-board'>
            {
                Object.keys(lists).map(listTitle => <List key={listTitle} title={listTitle} tasks={lists[listTitle]} moveTask={moveTask} />)
            }
        </div>
    );
};

export default Kanban; 