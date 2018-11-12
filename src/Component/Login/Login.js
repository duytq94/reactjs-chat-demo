import firebase from 'firebase'
import React, { Component } from 'react'
import ReactLoading from 'react-loading'
import { withRouter } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import { myFirebase, myFirestore } from '../../Config/MyFirebase'
import './Login.css'

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
    if (localStorage.getItem('id')) {
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
      .signInWithPopup(this.provider)
      .then(async result => {
        let user = result.user
        if (user) {
          const result = await myFirestore
            .collection('users')
            .where('id', '==', user.uid)
            .get()

          if (result.docs.length === 0) {
            // Set new data since this is a new user
            myFirestore
              .collection('users')
              .doc(this.state.id)
              .update({
                id: user.uid,
                nickname: user.displayName,
                aboutMe: '',
                photoUrl: user.photoURL
              })
              .then(data => {
                // Write user info to local
                localStorage.setItem('id', user.uid)
                localStorage.setItem('nickname', user.displayName)
                localStorage.setItem('photoUrl', user.photoURL)
                this.setState({ isLoading: false }, () => {
                  this.props.showToast(1, 'Login success')
                  this.props.history.push('/main')
                })
              })
          } else {
            // Write user info to local
            localStorage.setItem('id', result.docs[0].data().id)
            localStorage.setItem('nickname', result.docs[0].data().nickname)
            localStorage.setItem('photoUrl', result.docs[0].data().photoUrl)
            localStorage.setItem('aboutMe', result.docs[0].data().aboutMe)
            this.setState({ isLoading: false }, () => {
              this.props.showToast(1, 'Login success')
              this.props.history.push('/main')
            })
          }
        } else {
          this.props.showToast(0, 'User info not available')
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
