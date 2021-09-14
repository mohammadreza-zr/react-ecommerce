import React from 'react';
import './sign-in.styles.scss';
import FormInput from '../form-input/form-input.component';
import CustomButton from '../custom-button/custom-button.component';

class SignIn extends React.Component{
    constructor(){
        super();
        this.state={
            email: '',
            password: ''
        }
    }
    handleSubmit = event => {
        event.preventDefault();
        fetch('http://127.0.0.1:3000/api/customers/')
        .then(items => ()=>{
            let a = items.json();
            this.setState({email: a[1], password: ''})
        } )
        this.setState({email: '', password: ''})
    }
    handleChange = event => {
        const { value, name } = event.target;
        this.setState({[name]: value})
    }
    render(){
        return(
            <div className='sign-in'>
                <h2 className='title'>I already have an account</h2>
                <span>Sign in with your email and password</span>
                <form onSubmit={this.handleSubmit}>
                    <FormInput
                        type='email'
                        name='email'
                        value={this.state.email}
                        handleChange={this.handleChange}
                        label='Email'
                        required
                    />
                    <FormInput
                        type='password'
                        name='password'
                        value={this.state.password}
                        handleChange={this.handleChange}
                        label='Password'
                        required
                    />
                    <CustomButton type='submit'>Sign In</CustomButton>
                </form>
            </div>
        )
    }
}

export default SignIn;