import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { myFirebase } from '../../Config/MyFirebase';
import images from '../Themes/Images';
import './Main.css';

class Main extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isLoading: false
    }
  }

  onLogoutPress = () => {
    this.setState({ isLoading: true })
    myFirebase.auth().signOut().then(() => {
      this.setState({ isLoading: false })
      this.props.showToast(1, 'Logout success')
      this.props.history.push('/')
    }).catch(function (err) {
      this.setState({ isLoading: false })
      this.props.showToast(0, err.message)
    });
  }

  render() {
    return (
      <div className="root">
        <div className='header'>
          MAIN
          <img className='icLogout' src={images.ic_logout} onClick={this.onLogoutPress} />
        </div>

      </div>
    );
  }
}

export default withRouter(Main);
