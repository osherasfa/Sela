import React, { useState, useEffect } from 'react';
import "./CSS/kanban.css";
import Header from './Header';
import Column from './Column';
import TaskModal from './TaskModal';

const Kanban = () => {
  const [boards, setBoards] = useState([]);
  const [activeBoard, setActiveBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalColumnId, setModalColumnId] = useState(null);

  // Fetch all boards on mount
  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/boards');
      if (!res.ok) throw new Error('Failed to fetch boards list');
      const data = await res.json();
      setBoards(data);
      
      if (data.length > 0) {
        // Automatically load details of the first board
        await fetchBoardDetails(data[0].id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchBoardDetails = async (boardId) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/boards/${boardId}`);
      if (!res.ok) throw new Error('Failed to fetch board details');
      const data = await res.json();
      
      // Sort columns by position before setting state
      if (data.columns) {
        data.columns.sort((a, b) => Number(a.position) - Number(b.position));
        // Sort tasks inside columns by position
        data.columns.forEach(col => {
          if (col.tasks) {
            col.tasks.sort((a, b) => Number(a.position) - Number(b.position));
          }
        });
      }
      
      setActiveBoard(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Persists task movement between columns in both frontend state and backend
  const moveTask = async (taskId, fromColumnId, toColumnId) => {
    if (!activeBoard) return;

    // Optimistically update frontend state
    const sourceCol = activeBoard.columns.find((col) => col.id === fromColumnId);
    const targetCol = activeBoard.columns.find((col) => col.id === toColumnId);
    if (!sourceCol || !targetCol) return;

    const movedTask = sourceCol.tasks.find((task) => task.id === taskId);
    if (!movedTask) return;

    // Calculate updated columns state
    const updatedColumns = activeBoard.columns.map((col) => {
      if (col.id === fromColumnId) {
        return {
          ...col,
          tasks: col.tasks.filter((t) => t.id !== taskId),
        };
      }
      if (col.id === toColumnId) {
        return {
          ...col,
          tasks: [...col.tasks, { ...movedTask, columnId: toColumnId }],
        };
      }
      return col;
    });

    setActiveBoard((prev) => ({ ...prev, columns: updatedColumns }));

    // Send update request to backend api
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ columnId: toColumnId }),
      });
      if (!res.ok) throw new Error('Failed to update task column on server');
    } catch (err) {
      console.error('Drag and drop persistence failed, reverting board:', err);
      // Revert state by re-fetching
      fetchBoardDetails(activeBoard.id);
    }
  };

  // Open modal for task creation in a specific column (or default to first column)
  const openAddTaskModal = (columnId) => {
    setModalColumnId(columnId || activeBoard?.columns[0]?.id || '');
    setIsModalOpen(true);
  };

  // Submits task creation to backend and updates active board state
  const handleCreateTask = async (taskData) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      if (!res.ok) throw new Error('Failed to create task in backend');
      
      const newTask = await res.json();
      
      // Update local state
      setActiveBoard((prev) => {
        const updatedColumns = prev.columns.map((col) => {
          if (col.id === taskData.columnId) {
            return {
              ...col,
              tasks: [...col.tasks, newTask],
            };
          }
          return col;
        });
        return { ...prev, columns: updatedColumns };
      });
    } catch (err) {
      console.error(err);
      alert('Error creating task: ' + err.message);
    }
  };

  if (loading && !activeBoard) {
    return (
      <div className="kanban-status-container">
        <div className="loader"></div>
        <p>Loading Workspace Board...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="kanban-status-container error">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="6" x2="12.01" y2="6"/></svg>
        <h3>Failed to load workspace</h3>
        <p>{error}</p>
        <button onClick={fetchBoards} className="retry-btn">Retry Connection</button>
      </div>
    );
  }

  if (!activeBoard) {
    return (
      <div className="kanban-status-container">
        <h3>No Board Selected</h3>
        <p>There are no boards available in the database.</p>
      </div>
    );
  }

  return (
    <div className="workspace-container">
      {/* Workspace Header */}
      <Header
        boardTitle={activeBoard.title === 'Default BoardTitle' ? 'Workspace' : activeBoard.title}
        onAddTaskClick={() => openAddTaskModal()}
      />

      {/* Board Columns list */}
      <div className="board-lists-grid">
        {activeBoard.columns && activeBoard.columns.map((col) => (
          <Column
            key={col.id}
            column={col}
            moveTask={moveTask}
            onAddTaskClick={openAddTaskModal}
          />
        ))}
      </div>

      {/* Task Creation Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        columns={activeBoard.columns}
        defaultColumnId={modalColumnId}
        onSubmit={handleCreateTask}
      />
    </div>
  );
};

export default Kanban;