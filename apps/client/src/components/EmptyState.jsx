import React from 'react';
import Button from './Button';

const EmptyState = ({ onCreateTaskClick }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        {/* Document Icon in Screenshot */}
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
      </div>
      <p className="empty-state-text">No tasks currently. Board is empty</p>
      <Button variant="primary" className="empty-state-btn" onClick={onCreateTaskClick}>
        Create Task
      </Button>
    </div>
  );
};

export default EmptyState;
