import { Component } from 'react';
import HomePage from './pages/homepage/HomePageComponent';

class App extends Component{
  constructor(){
    super();
    this.state = {
      test: 'test'
    }
  }
  
  render(){
    return(
      <div className='App'>
        <HomePage />
      </div>
    )
  }
}

export default App;
