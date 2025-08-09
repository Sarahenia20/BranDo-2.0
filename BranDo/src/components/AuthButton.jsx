import React from 'react';
import { useSnapshot } from 'valtio';
import { useNavigate } from 'react-router-dom';
import state from '../store';
import { getContrastingColor } from '../config/helpers';

const AuthButton = ({ type, title, customStyles, handleClick }) => {
  const snap = useSnapshot(state);
  const navigate = useNavigate();

  const generateStyle = (type) => {
    if (type === 'filled') {
      return {
        backgroundColor: snap.color,
        color: getContrastingColor(snap.color),
      };
    } else if (type === 'outline') {
      return {
        borderWidth: '1px',
        borderColor: snap.color,
        color: snap.color,
      };
    }
  };

  const handleButtonClick = () => {
    if (handleClick) handleClick(); // Existing functionality (if any)
    setTimeout(() => {
      navigate('/signup');
    }, 600);// Navigates to the signup page
  };

  return (
    <button
      className={`px-2 py-1.5 flex-1 rounded-md ${customStyles}`}
      style={generateStyle(type)}
      onClick={handleButtonClick}
    >
      {title}
    </button>
  );
};

export default AuthButton;
