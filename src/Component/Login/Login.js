import firebase from 'firebase'
import React, { Component } from 'react'
import ReactLoading from 'react-loading'
import { withRouter } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import { myFirebase, myFirestore } from '../../Config/MyFirebase'
import './Login.css'
import { AppString } from './../Const'

class Login extends Component {
  constructor(props) {
    super(props)
    this.provider = new firebase.auth.GoogleAuthProvider()
    this.state = {
      isLoading: true
    }
  }

  componentDidMount() {
    this.checkLogin()
  }

  checkLogin = () => {
    if (localStorage.getItem(AppString.ID)) {
      this.setState({ isLoading: false }, () => {
        this.setState({ isLoading: false })
        this.props.showToast(1, 'Login success')
        this.props.history.push('/main')
      })
    } else {
      this.setState({ isLoading: false })
    }
  }

  onLoginPress = () => {
    this.setState({ isLoading: true })
    myFirebase
      .auth()
      .signInAnonymously()
      .then(async result => {
        let user = result.user
        if (user) {
          const result = await myFirestore
            .collection(AppString.NODE_USERS)
            .where(AppString.ID, '==', AppString.ANONYMOUS_ID)
            .get()

          if (result.docs.length === 0) {
            // Set new data since this is a new user
            myFirestore
              .collection('users')
              .doc(AppString.ANONYMOUS_ID)
              .set({
                id: AppString.ANONYMOUS_ID,
                nickname: AppString.ANONYMOUS_DISPLAY_NAME,
                photoUrl: AppString.ANONYMOUS_PHOTO_URL,
                aboutMe: AppString.ANONYMOUS_ABOUTE_ME
              })
              .then(data => {
                // Write user info to local
                localStorage.setItem(AppString.ID, AppString.ANONYMOUS_ID)
                localStorage.setItem(AppString.NICKNAME, AppString.ANONYMOUS_DISPLAY_NAME)
                localStorage.setItem(AppString.PHOTO_URL, AppString.ANONYMOUS_PHOTO_URL)
                localStorage.setItem(AppString.ABOUT_ME, AppString.ANONYMOUS_ABOUTE_ME)
                this.setState({ isLoading: false }, () => {
                  this.props.showToast(1, 'Login success')
                  this.props.history.push('/main')
                })
              })
          } else {
            // Write user info to local
            localStorage.setItem(AppString.ID, AppString.ANONYMOUS_ID)
            localStorage.setItem(AppString.NICKNAME, AppString.ANONYMOUS_DISPLAY_NAME)
            localStorage.setItem(AppString.PHOTO_URL, AppString.ANONYMOUS_PHOTO_URL)
            localStorage.setItem(AppString.ABOUT_ME, AppString.ANONYMOUS_ABOUTE_ME)
            this.setState({ isLoading: false }, () => {
              this.props.showToast(1, 'Login success')
              this.props.history.push('/main')
            })
          }
        } else {
          this.props.showToast(0, 'Can not get data')
        }
      })
      .catch(err => {
        this.props.showToast(0, err.message)
        this.setState({ isLoading: false })
      })
  }

  render() {
    return (
      <div className="viewRoot">
        <div className="header">CHAT DEMO</div>
        <button className="btnLogin" type="submit" onClick={this.onLoginPress}>
          SIGN IN WITH GOOGLE
        </button>

        {this.state.isLoading ? (
          <div className="viewLoading">
            <ReactLoading
              type={'spin'}
              color={'#203152'}
              height={'3%'}
              width={'3%'}
            />
          </div>
        ) : null}
      </div>
    )
  }
}

export default withRouter(Login)
