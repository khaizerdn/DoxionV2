import React, { useState } from 'react';

const Button = ({ type, children, onClick, width = '100%', height = 'var(--global-button-height)', fontSize = 'var(--font-size-2)', className = '', style = {} }) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseColor = type === 'primary' ? 'var(--color-primary-dark)' : 'var(--elevation-2)';
  const hoverColor = type === 'primary' ? '#6e6e6e' : 'var(--elevation-1)';

  const buttonStyles = `
    button {
      padding: 0;
      width: ${width};
      height: ${height}; /* Use the height prop directly */
      font-size: ${fontSize};
      font-weight: 700;
      font-family: var(--font-family);
      border: none;
      border-radius: var(--global-border-radius);
      cursor: pointer;
      transition: background-color 0.3s;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: ${type === 'primary' ? '0 2px 4px rgba(0, 0, 0, 0.05)' : '0 1px 2px rgba(0, 0, 0, 0.05)'};
    }

    button:focus {
      outline: none;
    }
  `;

  return (
    <>
      <style>{buttonStyles}</style>
      <button
        className={`${type === 'primary' ? 'primary-button' : 'muted-button'} ${className}`}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          backgroundColor: isHovered ? hoverColor : baseColor,
          color: type === 'primary' ? '#ffffff' : 'var(--color-muted-dark)',
          height, // Ensure height prop is applied inline
          ...style, // Allow additional styles to be merged
        }}
      >
        {children}
      </button>
    </>
  );
};

export default Button;