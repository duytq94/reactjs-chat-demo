import React, { Component } from 'react'
import ReactLoading from 'react-loading'
import { withRouter } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import { myStorage, myFirestore } from '../../Config/MyFirebase'
import images from './../Themes/Images'
import './Profile.css'
import { AppString } from './../Const'

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      id: localStorage.getItem(AppString.ID),
      nickname: localStorage.getItem(AppString.NICKNAME),
      aboutMe: localStorage.getItem(AppString.ABOUT_ME),
      photoUrl: localStorage.getItem(AppString.PHOTO_URL)
    }
    this.newAvatar = null
    this.newPhotoUrl = ''
  }

  componentDidMount() {
    this.checkLogin()
  }

  checkLogin = () => {
    if (!localStorage.getItem(AppString.ID)) {
      this.props.history.push('/')
    }
  }

  render() {
    return (
      <div className="root">
        <div className="header">
          <span>PROFILE</span>
        </div>

        <img className="avatar" alt="Avatar" src={this.state.photoUrl} />

        <span className="textLabel">Nickname:</span>
        <input
          disabled
          className="textInput"
          value={this.state.nickname ? this.state.nickname : ''}
          placeholder="Your nickname..."
        />
        <span className="textLabel">About me:</span>
        <input
          disabled
          className="textInput"
          value={this.state.aboutMe ? this.state.aboutMe : ''}
          placeholder="Tell about yourself..."
        />

        <button className="btnUpdate" onClick={() => this.props.history.goBack()}>
          BACK
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

export default withRouter(Profile)
