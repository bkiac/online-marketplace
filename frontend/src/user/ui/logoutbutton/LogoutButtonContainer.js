import { connect } from 'react-redux';
import LogoutButton from './LogoutButton';
import { logoutUser } from './LogoutButtonActions';

const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = dispatch => ({
  onLogoutUserClick: (event) => {
    event.preventDefault();

    dispatch(logoutUser());
  },
});

const LogoutButtonContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LogoutButton);

export default LogoutButtonContainer;
