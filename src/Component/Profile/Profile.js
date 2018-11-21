import React, { Component } from 'react'
import ReactLoading from 'react-loading'
import { withRouter } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import { myFireStorage, myFirestore } from '../../Config/MyFirebase'
import images from './../Themes/Images'
import './Profile.css'

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      id: localStorage.getItem('id'),
      nickname: localStorage.getItem('nickname'),
      aboutMe: localStorage.getItem('aboutMe'),
      photoUrl: localStorage.getItem('photoUrl')
    }
    this.newAvatar = null
    this.newPhotoUrl = ''
  }

  componentDidMount() {
    this.checkLogin()
  }

  checkLogin = () => {
    if (!localStorage.getItem('id')) {
      this.props.history.push('/')
    }
  }

  onChangeNickname = event => {
    this.setState({ nickname: event.target.value })
  }

  onChangeAboutMe = event => {
    this.setState({ aboutMe: event.target.value })
  }

  onChangeAvatar = event => {
    if (event.target.files && event.target.files[0]) {
      this.newAvatar = event.target.files[0]
      this.setState({ photoUrl: URL.createObjectURL(event.target.files[0]) })
    } else {
      this.props.showToast(0, 'Something wrong with input file')
    }
  }

  uploadAvatar = () => {
    this.setState({ isLoading: true })
    if (this.newAvatar) {
      const uploadTask = myFireStorage
        .ref()
        .child(this.state.id)
        .put(this.newAvatar)
      uploadTask.on(
        'state_changed',
        null,
        err => {
          this.props.showToast(0, err.message)
        },
        () => {
          this.updateUserInfo(true)
        }
      )
    } else {
      this.updateUserInfo(false)
    }
  }

  updateUserInfo = isUpdatePhotoUrl => {
    myFireStorage
      .ref()
      .child(this.state.id)
      .getDownloadURL()
      .then(url => {
        this.newPhotoUrl = url
        myFirestore
          .collection('users')
          .doc(this.state.id)
          .update({
            nickname: this.state.nickname,
            aboutMe: this.state.aboutMe,
            photoUrl: url
          })
          .then(data => {
            localStorage.setItem('nickname', this.state.nickname)
            localStorage.setItem('aboutMe', this.state.aboutMe)
            if (isUpdatePhotoUrl) {
              localStorage.setItem('photoUrl', this.newPhotoUrl)
            }
            this.setState({ isLoading: false })
            this.props.showToast(1, 'Update info success')
          })
      })
  }

  render() {
    return (
      <div className="root">
        <div className="header">
          <span>PROFILE</span>
        </div>

        <img className="avatar" alt="Avatar" src={this.state.photoUrl} />

        <div className="viewWrapInputFile">
          <img
            className="imgInputFile"
            alt="icon gallery"
            src={images.ic_input_file}
            onClick={() => this.refInput.click()}
          />
          <input
            ref={el => {
              this.refInput = el
            }}
            className="viewInputFile"
            type="file"
            onChange={this.onChangeAvatar}
          />
        </div>

        <span className="textLabel">Nickname:</span>
        <input
          className="textInput"
          value={this.state.nickname ? this.state.nickname : ''}
          placeholder="Your nickname..."
          onChange={this.onChangeNickname}
        />
        <span className="textLabel">About me:</span>
        <input
          className="textInput"
          value={this.state.aboutMe ? this.state.aboutMe : ''}
          placeholder="Tell about yourself..."
          onChange={this.onChangeAboutMe}
        />

        <button className="btnUpdate" onClick={this.uploadAvatar}>
          UPDATE
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
