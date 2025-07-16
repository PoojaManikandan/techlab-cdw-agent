import React from 'react';
import PropTypes from 'prop-types';
import './Header.css'; // Import styles for the header

const Header = ({ logo, links }) => {
  return (
    <header className="header">
      <div className="header__logo">
        <img src={logo} alt="Logo" />
      </div>
      <nav className="header__nav">
        <ul className="header__nav-list">
          {links.map((link, index) => (
            <li key={index} className="header__nav-item">
              <a href={link.href} className="header__nav-link">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

Header.propTypes = {
  logo: PropTypes.string.isRequired,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Header;