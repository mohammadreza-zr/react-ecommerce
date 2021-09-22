import React from 'react';
import './sign-in.styles.scss';
import FormInput from '../form-input/form-input.component';
import CustomButton from '../custom-button/custom-button.component';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { setCurrentUser } from '../../redux/user/user-actions';

class SignIn extends React.Component {
  constructor() {
    super();
    this.state = {
      loginEmail: '',
      loginPassword: '',
      loginMessage: '',
      redirect: false,
    };
  }
  handleSubmit = async (event) => {
    event.preventDefault();
    const { setCurrentUser } = this.props;
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      Credentials: 'include',
      body: JSON.stringify({
        email: this.state.loginEmail,
        password: this.state.loginPassword,
      }),
    };
    await fetch(`http://localhost:3000/api/users/login`, requestOptions)
      .then(async (response) => await response.json())
      .then(async (res) => {
        // eslint-disable-next-line no-unused-expressions
        res.status === 'success'
          ? (this.setState({
              loginEmail: '',
              loginPassword: '',
              loginMessage: await res.message,
              redirect: true,
            }),
            localStorage.setItem('x-auth-token', res['x-auth-token']),
            setCurrentUser(res.user))
          : this.setState({ loginMessage: await res.message });
      });
  };
  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };
  render() {
    return (
      <div className="sign-in mr-64">
        <h2 className="title">I already have an account</h2>
        <span>Sign in with your email and password</span>
        <form className="relative" onSubmit={this.handleSubmit}>
          <FormInput
            type="email"
            name="loginEmail"
            value={this.state.loginEmail}
            handleChange={this.handleChange}
            label="Email"
            required
          />
          <FormInput
            type="password"
            name="loginPassword"
            value={this.state.loginPassword}
            handleChange={this.handleChange}
            label="Password"
            required
          />
          <CustomButton className="custom-button" type="submit">
            Sign In
          </CustomButton>
          <p>{this.state.loginMessage}</p>
          {this.state.redirect ? <Redirect to="/" /> : null}
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});
export default connect(null, mapDispatchToProps)(SignIn);
