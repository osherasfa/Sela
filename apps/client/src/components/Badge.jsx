import React from 'react';

const Badge = ({
  children,
  text,
  variant = 'default', // default, tag, count, time, date
  colorScheme = 'gray', // blue, green, purple, orange, red, gray, etc.
  icon,
  className = '',
  ...props
}) => {
  const content = text || children;

  // Dynamically map categories or common tag names to gorgeous, matching colors if variant is "tag"
  let computedColorScheme = colorScheme;
  if (variant === 'tag' && typeof content === 'string') {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('wireframe')) computedColorScheme = 'purple';
    else if (lowerContent.includes('design')) computedColorScheme = 'orange';
    else if (lowerContent.includes('media')) computedColorScheme = 'teal';
    else if (lowerContent.includes('data')) computedColorScheme = 'blue';
    else if (lowerContent.includes('develop')) computedColorScheme = 'indigo';
    else if (lowerContent.includes('test')) computedColorScheme = 'rose';
  }

  return (
    <span
      className={`badge badge-${variant} badge-color-${computedColorScheme} ${className}`}
      {...props}
    >
      {icon && <span className="badge-icon">{icon}</span>}
      <span className="badge-text">{content}</span>
    </span>
  );
};

export default Badge;
