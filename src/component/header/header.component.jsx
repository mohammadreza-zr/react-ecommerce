import React from 'react';
import './header.styles.scss';
import { Link } from 'react-router-dom';
import {ReactComponent as Logo} from '../../assets/images/crown.svg'

const Header = () => (
    <div className='header'>
        <Link to='/' className='logo-container'>
            <Logo className='logo'/>
        </Link>

        <div className='options'>
            <Link to='/shop' className='option'>SHOP</Link>
            <Link to='/shop' className='option'>CONTACT</Link>
            <Link to='/signin' className='option'>Signin</Link>
            <Link to='/customers' className='option'>Customers</Link>
        </div>
    </div>
)
export default Header;