import React, { Component } from 'react'
import ReactLoading from 'react-loading'
import { withRouter } from 'react-router-dom'
import { myFirebase, myFirestore } from '../../Config/MyFirebase'
import images from '../Themes/Images'
import WelcomeBoard from '../WelcomeBoard/WelcomeBoard'
import './Main.css'
import ChatBoard from './../ChatBoard/ChatBoard'

class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      isOpenDialogConfirmLogout: false,
      currentPeerUser: null
    }
    this.currentUserId = localStorage.getItem('id')
    this.currentUserAvatar = localStorage.getItem('photoUrl')
    this.currentUserNickname = localStorage.getItem('nickname')
    this.listUser = []
  }

  componentDidMount() {
    this.checkLogin()
  }

  checkLogin = () => {
    if (!localStorage.getItem('id')) {
      this.setState({ isLoading: false }, () => {
        this.props.history.push('/')
      })
    } else {
      this.getListUser()
    }
  }

  getListUser = async () => {
    const result = await myFirestore.collection('users').get()
    if (result.docs.length > 0) {
      this.listUser = [...result.docs]
      this.setState({ isLoading: false })
    }
  }

  onLogoutClick = () => {
    this.setState({
      isOpenDialogConfirmLogout: true
    })
  }

  doLogout = () => {
    this.setState({ isLoading: true })
    myFirebase
      .auth()
      .signOut()
      .then(() => {
        this.setState({ isLoading: false }, () => {
          localStorage.clear()
          this.props.showToast(1, 'Logout success')
          this.props.history.push('/')
        })
      })
      .catch(function(err) {
        this.setState({ isLoading: false })
        this.props.showToast(0, err.message)
      })
  }

  hideDialogConfirmLogout = () => {
    this.setState({
      isOpenDialogConfirmLogout: false
    })
  }

  onProfileClick = () => {
    this.props.history.push('/profile')
  }

  renderListUser = () => {
    if (this.listUser.length > 0) {
      let viewListUser = []
      this.listUser.forEach((item, index) => {
        viewListUser.push(
          <button
            className="viewWrapItem"
            key={item.data().id}
            onClick={() => {
              this.setState({ currentPeerUser: item.data() })
            }}
          >
            <img
              className="viewAvatarItem"
              src={item.data().photoUrl}
              alt="icon avatar"
            />
            <div className="viewWrapContentItem">
              <span className="textItem">{`Nickname: ${
                item.data().nickname
              }`}</span>
              <span className="textItem">{`About me: ${
                item.data().abouteMe ? item.data().abouteMe : 'Not available'
              }`}</span>
            </div>
          </button>
        )
      })
      return viewListUser
    } else {
      return null
    }
  }

  render() {
    return (
      <div className="root">
        {/* Header */}
        <div className="header">
          <span>MAIN</span>
          <img
            className="icProfile"
            alt="An icon default avatar"
            src={images.ic_default_avatar}
            onClick={this.onProfileClick}
          />
          <img
            className="icLogout"
            alt="An icon logout"
            src={images.ic_logout}
            onClick={this.onLogoutClick}
          />
        </div>

        {/* Body */}
        <div className="body">
          <div className="viewListUser"> {this.renderListUser()}</div>
          <div className="viewBoard">
            {this.state.currentPeerUser ? (
              <ChatBoard currentPeerUser={this.state.currentPeerUser} />
            ) : (
              <WelcomeBoard
                currentUserNickname={this.currentUserNickname}
                currentUserAvatar={this.currentUserAvatar}
              />
            )}
          </div>
        </div>

        {/* Dialog confirm */}
        {this.state.isOpenDialogConfirmLogout ? (
          <div className="viewCoverScreen">
            {this.renderDialogConfirmLogout()}
          </div>
        ) : null}

        {/* Loading */}
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

  renderDialogConfirmLogout = () => {
    return (
      <div>
        <div className="titleDialogConfirmLogout">Are you sure to logout?</div>
        <div className="viewWrapButtonDialogConfirmLogout">
          <button className="btnYes" onClick={this.doLogout}>
            YES
          </button>
          <button className="btnNo" onClick={this.hideDialogConfirmLogout}>
            CANCEL
          </button>
        </div>
      </div>
    )
  }
}

export default withRouter(Main)
