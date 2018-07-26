import { connect } from 'react-redux';
import SignUpForm from './SignUpForm';
import { signUpUser } from './SignUpFormActions';

const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = dispatch => ({
  onSignUpFormSubmit: (name) => {
    event.preventDefault();

    dispatch(signUpUser(name));
  },
});

const SignUpFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignUpForm);

export default SignUpFormContainer;
