import firebase from 'firebase';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { myFirebase } from '../../Config/MyFirebase';
import './Login.css';
import ReactLoading from 'react-loading';

class Login extends Component {

  constructor(props) {
    super(props)
    this.provider = new firebase.auth.GoogleAuthProvider();
    this.state = {
      isLoading: false
    }
  }

  onLoginPress = () => {
    this.setState({ isLoading: true })
    myFirebase.auth().signInWithPopup(this.provider).then((result) => {
      let token = result.credential.accessToken;
      let user = result.user;
      if (token && user) {
        toast.success('Login success')
        setTimeout(() => {
          this.props.history.push('/main')
        }, 2000)
      }
    }).catch((err) => {
      this.setState({ isLoading: false })
      toast.warning(err.message)
    })
  }


  render() {
    return (
      <div className="viewRoot">
        <ToastContainer autoClose={2000} position={toast.POSITION.BOTTOM_RIGHT} />
        <div className='header'>CHAT DEMO</div>
        <button
          className='btnLogin'
          type='submit'
          onClick={this.onLoginPress}
        >SIGN IN WITH GOOGLE</button>

        {this.state.isLoading ?
          <div className='viewLoading' >
            <ReactLoading type={'spin'} color={'#203152'} height={'3%'} width={'3%'} />
          </div> :
          null}

      </div>
    );
  }
}

export default withRouter(Login);
