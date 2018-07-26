import { connect } from 'react-redux';
import ProfileForm from './ProfileForm';
import { updateUser } from './ProfileFormActions';

const mapStateToProps = (state, ownProps) => ({
  name: state.user.data.name,
});

const mapDispatchToProps = dispatch => ({
  onProfileFormSubmit: (name) => {
    event.preventDefault();

    dispatch(updateUser(name));
  },
});

const ProfileFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileForm);

export default ProfileFormContainer;
