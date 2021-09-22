import React from 'react';
import './sign-up.styles.scss';
import FormInput from '../form-input/form-input.component';
import CustomButton from '../custom-button/custom-button.component';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { setCurrentUser } from '../../redux/user/user-actions';

class SignUp extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      registerMessage: '',
      fieldMessage: '',
    };
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const { setCurrentUser } = this.props;
    if (this.state.confirmPassword !== this.state.password) {
      return this.setState({ fieldMessage: 'password not match' });
    } else this.setState({ fieldMessage: '' });

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      Credentials: 'include',
      body: JSON.stringify({
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
      }),
    };
    await fetch(`http://localhost:3000/api/users/register`, requestOptions)
      .then(async (response) => await response.json())
      .then(async (res) => {
        // eslint-disable-next-line no-unused-expressions
        res.status === 'success'
          ? (this.setState({
              name: '',
              email: '',
              password: '',
              confirmPassword: '',
              registerMessage: await res.message,
            }),
            localStorage.setItem('x-auth-token', res['x-auth-token']),
            setCurrentUser(res.user),
            (<Redirect to="/" />))
          : this.setState({ registerMessage: await res.message });
      });
  };
  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    return (
      <div className="sign-in">
        <h2 className="title">I don't have an account</h2>
        <span>Sign up with your email and password</span>
        <form className="relative" onSubmit={this.handleSubmit}>
          <FormInput
            type="text"
            name="name"
            value={this.state.name}
            handleChange={this.handleChange}
            label="Name"
            required
          />
          <FormInput
            type="email"
            name="email"
            value={this.state.email}
            handleChange={this.handleChange}
            label="Email"
            required
          />
          <FormInput
            type="password"
            name="password"
            value={this.state.password}
            handleChange={this.handleChange}
            label="Password"
            required
          />
          <FormInput
            type="password"
            name="confirmPassword"
            value={this.state.confirmPassword}
            handleChange={this.handleChange}
            label="Confirm password"
            onBlur={this.handleBlue}
            required
          />
          <CustomButton className="custom-button" type="submit">
            Sign Up
          </CustomButton>
          <p>{this.state.registerMessage}</p>
          <p>{this.state.fieldMessage}</p>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});
export default connect(null, mapDispatchToProps)(SignUp);
