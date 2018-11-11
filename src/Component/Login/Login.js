import firebase from 'firebase';
import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import { withRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { myFirebase } from '../../Config/MyFirebase';
import './Login.css';

class Login extends Component {

  constructor(props) {
    super(props)
    this.provider = new firebase.auth.GoogleAuthProvider()
    this.state = {
      isLoading: false
    }
  }

  componentDidMount() {
    this.checkLogin()
  }

  checkLogin = () => {
    this.setState({ isLoading: true })
    myFirebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ isLoading: false })
        this.props.showToast(1, 'Login success')
        this.props.history.push('/main')
      } else {
        this.setState({ isLoading: false })
      }
    });
  }

  onLoginPress = () => {
    this.setState({ isLoading: true })
    myFirebase.auth().signInWithPopup(this.provider).then((result) => {
      let user = result.user;
      if (user) {
        localStorage.setItem('id', user.uid)
        localStorage.setItem('nickname', user.displayName)
        localStorage.setItem('photoUrl', user.photoURL)
      } else {
        this.props.showToast(0, 'User info not available')
      }
    }).catch((err) => {
      this.setState({ isLoading: false })
      this.props.showToast(0, err.message)
    })
  }


  render() {
    return (
      <div className="viewRoot">
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
