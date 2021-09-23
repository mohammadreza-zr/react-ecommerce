import React, { Component } from 'react';
import './App.css';
//components
import HomePage from './pages/homepage/HomePageComponent';
import ShopPage from './pages/shop/shop.component';
import Header from './component/header/header.component';
import SignInAndSignUp from './pages/sign-in-and-signup/sign-in-and-sign-up.component';
import Customers from './component/customers/customers.component';
import logout from './component/logout.component';
import CheckoutPage from './pages/checkout/checkout.component';

import { Switch, Route } from 'react-router-dom';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { setCurrentUser } from './redux/user/user-actions';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from './redux/user/user-selector';

class App extends Component {
  async componentDidMount() {
    const { setCurrentUser } = this.props;
    let token = localStorage.getItem('x-auth-token');
    if (token) {
      const options = { headers: { 'x-auth-token': token } };
      await fetch(`http://localhost:3000/api/users/login`, options)
        .then(async (response) => await response.json())
        .then(async (res) => {
          setCurrentUser(await res);
        });
    }
  }
  componentDidUpdate() {
    const { setCurrentUser } = this.props;
    // eslint-disable-next-line no-unused-expressions
    localStorage.getItem('x-auth-token') ? null : setCurrentUser(null);
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/shop" component={ShopPage} />
          <Route
            exact
            path="/signin"
            render={() =>
              this.props.currentUser ? <Redirect to="/" /> : <SignInAndSignUp />
            }
          />
          <Route exact path="/logout" component={logout} />
          <Route exact path="/checkout" component={CheckoutPage} />
          <Route exact path="/customers" component={Customers} />
        </Switch>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});
const mapStateToProps = createStructuredSelector({ currentUser: selectCurrentUser });

export default connect(mapStateToProps, mapDispatchToProps)(App);
