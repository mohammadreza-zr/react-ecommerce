import { Redirect } from 'react-router';
import { setCurrentUser } from '../redux/user/user-actions';
import { connect } from 'react-redux';

const logout = ({ setCurrentUser }) => {
  localStorage.removeItem('x-auth-token');
  setCurrentUser(null);
  return <Redirect to="/signin" />;
};
const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});
export default connect(null, mapDispatchToProps)(logout);
