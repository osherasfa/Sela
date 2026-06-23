import React, { useState } from 'react';
import Button from './Button';

const TaskModal = ({ isOpen, onClose, columns = [], defaultColumnId, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [columnId, setColumnId] = useState(defaultColumnId || '');

  // Reset local inputs when model resets/opens
  React.useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setColumnId(defaultColumnId || (columns[0]?.id || ''));
    }
  }, [isOpen, defaultColumnId, columns]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !columnId) return;
    
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      columnId,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Task</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="task-title">Task Title</label>
            <input
              id="task-title"
              type="text"
              placeholder="e.g. Graphic Design Edits"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-column">Status Column</label>
            <select
              id="task-column"
              value={columnId}
              onChange={(e) => setColumnId(e.target.value)}
              required
            >
              {columns.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              rows="3"
              placeholder="Provide context or instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={!title.trim()}>
              Create Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
