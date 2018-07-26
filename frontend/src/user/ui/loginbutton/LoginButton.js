import React from 'react';

const LoginButton = ({ onLoginUserClick }) => (
  <li className="pure-menu-item">
    <a href="#" className="pure-menu-link" onClick={event => onLoginUserClick(event)}>Login</a>
  </li>
);

export default LoginButton;
