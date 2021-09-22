import React from 'react';
import './header.styles.scss';
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../../assets/images/crown.svg';
import { connect } from 'react-redux';

const Header = ({ currentUser } = this.props) => (
  <div className="header">
    <Link to="/" className="logo-container">
      <Logo className="logo" />
    </Link>
    <div className="options">
      <Link to="/shop" className="option">
        SHOP
      </Link>
      <Link to="/shop" className="option">
        CONTACT
      </Link>
      {currentUser ? (
        <Link to="/logout" className="option">
          Logout
        </Link>
      ) : (
        <Link to="/signin" className="option">
          Sign in
        </Link>
      )}
      {currentUser ? (
        currentUser.role === 'admin' ? (
          <Link to="/customers" className="option">
            Customers
          </Link>
        ) : null
      ) : null}
    </div>
  </div>
);

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});
export default connect(mapStateToProps)(Header);
