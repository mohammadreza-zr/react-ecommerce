import React, { Component } from 'react';
import './App.css'
import HomePage from './pages/homepage/HomePageComponent';
import ShopPage from './pages/shop/shop.component';
import Header from './component/header/header.component';
import { Switch, Route } from 'react-router-dom';
import SignInAndSignUp from './pages/sign-in-and-signup/sign-in-and-sign-up.component';
import Customers from './component/customers/customers.component';

class App extends Component{
  constructor(){
    super();
    this.state = {
      
    }
  }
  
  render(){
    return(
      <div className='App'>
        <Header/>
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route exact path='/shop' component={ShopPage} />
          <Route exact path='/signin' component={SignInAndSignUp} />
          <Route exact path='/customers' component={Customers} />
        </Switch>
      </div>
    )
  }
}

export default App;
