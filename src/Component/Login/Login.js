import firebase from 'firebase';
import React, { Component } from 'react';
import './Login.css';
import { myFirebase, myFirestore } from '../../Config/MyFirebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Login extends Component {

  constructor(props) {
    super(props)
    this.provider = new firebase.auth.GoogleAuthProvider();
  }

  onLoginPress = () => {
    myFirebase.auth().signInWithPopup(this.provider).then((result) => {
      let token = result.credential.accessToken;
      let user = result.user;
      if (token && user) {
        toast.success('Login success')
      }
    }).catch((err) => {
      toast.warning(err.message)
    })
  }


  render() {
    return (
      <div className="root">
        <ToastContainer autoClose={5000} position={toast.POSITION.BOTTOM_RIGHT} />
        <span className='textTitle'>CHAT DEMO</span>
        <button
          className='btnLogin'
          type='submit'
          onClick={this.onLoginPress}
        >SIGN IN WITH GOOGLE</button>
      </div>
    );
  }
}

export default Login;
