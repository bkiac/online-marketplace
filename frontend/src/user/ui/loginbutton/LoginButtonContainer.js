import { connect } from 'react-redux';
import LoginButton from './LoginButton';
import { loginUser } from './LoginButtonActions';

const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = dispatch => ({
  onLoginUserClick: (event) => {
    event.preventDefault();

    dispatch(loginUser());
  },
});

const LoginButtonContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginButton);

export default LoginButtonContainer;
