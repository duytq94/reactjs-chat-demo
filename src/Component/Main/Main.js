import React, { Component } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Main.css';
import { withRouter } from 'react-router-dom'
import images from '../Themes/Images'
import { myFirebase, myFirestore } from '../../Config/MyFirebase';

class Main extends Component {

  constructor(props) {
    super(props)
  }

  onLogoutPress = () => {
    myFirebase.auth().signOut().then(() => {
      toast.success('Logout success')
      setTimeout(() => {
        this.props.history.push('/')
      }, 2000)
    }).catch(function (err) {
      toast.warning(err.message)
    });
  }

  render() {
    return (
      <div className="root">
        <ToastContainer autoClose={2000} position={toast.POSITION.BOTTOM_RIGHT} />
        <div className='header'>
          MAIN
          <img className='icLogout' src={images.ic_logout} onClick={this.onLogoutPress} />
        </div>

      </div>
    );
  }
}

export default withRouter(Main);
