import React, { useRef, useState } from 'react';
import Badge from './Badge';

const parseTaskDetails = (task) => {
  try {
    if (task.description && task.description.startsWith('{')) {
      return JSON.parse(task.description);
    }
  } catch (e) {
    // Ignore and fallback
  }

  // Create deterministic mock values based on the task title or ID to render rich details
  const seed = task.title || '';
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const avatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', // Woman 1
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', // Man 1
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150', // Man 2
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', // Woman 2
  ];

  const categories = ['Wireframes', 'Data Entry', 'Media', 'Design', 'Graphic Design', 'UI Design'];
  
  const categoryIndex = hash % categories.length;
  const avatarIndex = hash % avatars.length;
  const dateDay = (hash % 15) + 15; // Aug 15-30
  const durationHrs = (hash % 6) + 1; // 1h-6h
  const logHrs = hash % Math.max(2, durationHrs);
  const logMins = (hash * 7) % 60;
  
  return {
    description: task.description || '',
    tag: categories[categoryIndex],
    avatar: avatars[avatarIndex],
    date: `Aug ${dateDay}`,
    duration: `${durationHrs}h`,
    logTime: logHrs > 0 ? `${logHrs}h ${logMins}m` : `${logMins}min`,
    commentsCount: hash % 4,
  };
};

const Card = ({ task, columnId, moveTask }) => {
  const details = parseTaskDetails(task);
  const cardRef = useRef(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e) => {
    // Only drag with left click, and ignore clicks on interactive child elements
    if (e.button !== 0) return;
    if (e.target.closest('button') || e.target.closest('.badge') || e.target.closest('svg')) return;

    e.preventDefault();
    dragStart.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;
    
    // Visually shift the card using translate and add a subtle rotation + shadow
    cardRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(-1deg)`;
    cardRef.current.style.zIndex = '1000';
    cardRef.current.style.boxShadow = 'var(--shadow-lg)';
    cardRef.current.style.opacity = '0.7';
    cardRef.current.style.pointerEvents = 'none'; // Essential so document.elementFromPoint can read columns underneath
  };

  const handleMouseUp = (e) => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    setIsDragging(false);

    if (cardRef.current) {
      cardRef.current.style.transform = '';
      cardRef.current.style.zIndex = '';
      cardRef.current.style.boxShadow = '';
      cardRef.current.style.opacity = '';
      cardRef.current.style.pointerEvents = '';
    }

    // Determine target column under released cursor
    const dropTarget = document.elementFromPoint(e.clientX, e.clientY);
    const targetColumn = dropTarget?.closest('.board-column');
    if (targetColumn) {
      const targetColumnId = targetColumn.getAttribute('data-column-id');
      if (targetColumnId && targetColumnId !== columnId) {
        moveTask(task.id, columnId, targetColumnId);
      }
    }
  };

  return (
    <div
      ref={cardRef}
      className={`task-card ${isDragging ? 'dragging' : ''}`}
      onMouseDown={handleMouseDown}
    >
      {/* Category Tag & Avatar */}
      <div className="card-top-row">
        <Badge variant="tag">{details.tag}</Badge>
        <img src={details.avatar} alt="Assignee" className="card-avatar" />
      </div>

      {/* Title */}
      <h3 className="card-title">{task.title}</h3>

      {/* Description if plain text */}
      {details.description && !task.description.startsWith('{') && (
        <p className="card-description">{details.description}</p>
      )}

      {/* Badges / Metrics Row */}
      <div className="card-metrics-row">
        {/* Date estimate */}
        <Badge variant="date" icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        }>
          {details.date}
        </Badge>

        {/* Time duration */}
        <Badge variant="time" icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        }>
          {details.duration}
        </Badge>
      </div>

      {/* Bottom Logged Time and Comments */}
      <div className="card-footer-row">
        <Badge variant="count" icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
        }>
          Log: {details.logTime}
        </Badge>

        <span className="card-comments">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <span className="comments-count">{details.commentsCount}</span>
        </span>
      </div>
    </div>
  );
};

export default Card;
