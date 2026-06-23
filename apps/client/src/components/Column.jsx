import React, { useState } from 'react';
import Card from './Card';
import EmptyState from './EmptyState';

const Column = ({ column, moveTask, onAddTaskClick }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const { id, title, tasks = [] } = column;

  // Custom styling for column names to match specific headers in screenshot
  const displayTitle = 
    title === 'To Do' ? 'To-do' : 
    title === 'Testing' ? 'Review Ready' : 
    title === 'Done' ? 'Completed' : 
    title;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    const sourceColumnId = e.dataTransfer.getData('sourceColumnId');
    if (taskId && sourceColumnId && sourceColumnId !== id) {
      moveTask(taskId, sourceColumnId, id);
    }
  };

  return (
    <div
      className={`board-column ${isDragOver ? 'column-drag-over' : ''}`}
      data-column-id={id}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="column-header">
        <div className="column-header-left">
          <span className="column-title">{displayTitle}</span>
          <span className="column-count-badge">{tasks.length}</span>
        </div>
        <div className="column-header-right">
          <button className="column-action-btn" onClick={() => onAddTaskClick(id)} title="Add task">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
          <button className="column-action-btn" title="More options">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
          </button>
        </div>
      </div>

      {/* Task List / Drop Area */}
      <div className="column-tasks">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <Card key={task.id} task={task} columnId={id} moveTask={moveTask} />
          ))
        ) : (
          <EmptyState onCreateTaskClick={() => onAddTaskClick(id)} />
        )}
      </div>
    </div>
  );
};

export default Column;
