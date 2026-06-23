import React from 'react';

const SidebarItem = ({
  icon,
  label,
  active = false,
  onClick
}) => {
  return (
    <button
      className={`sidebar-item ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      {icon && <span className="sidebar-item-icon">{icon}</span>}
      <span className="sidebar-item-label">{label}</span>
    </button>
  );
};

export default SidebarItem;
