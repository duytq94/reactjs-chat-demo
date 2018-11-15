import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import { myFirebase, myFirestore } from '../../Config/MyFirebase'
import images from '../Themes/Images'
import './Main.css'
import ReactLoading from 'react-loading'
import moment from 'moment'

class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      isLoadHistory: false,
      isOpenDialogConfirmLogout: false
    }
    this.currentUserId = localStorage.getItem('id')
    this.currentUserAvatar = localStorage.getItem('photoUrl')
    this.currentUserNickname = localStorage.getItem('nickname')
    this.listUser = []
    this.currentPeerUser = null
    this.groupChatId = null
    this.listMessage = []
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

  getListHistory = () => {
    this.listMessage.length = 0
    this.setState({ isLoadHistory: true })
    if (
      this.hashString(this.currentUserId) <=
      this.hashString(this.currentPeerUser.id)
    ) {
      this.groupChatId = `${this.currentUserId}-${this.currentPeerUser.id}`
    } else {
      this.groupChatId = `${this.currentPeerUser.id}-${this.currentUserId}`
    }

    myFirestore
      .collection('messages')
      .doc(this.groupChatId)
      .collection(this.groupChatId)
      .orderBy('timestamp', 'desc')
      .limit(40)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          this.listMessage.push(doc.data())
        })
        this.setState({ isLoadHistory: false })
      })
      .catch(err => {
        console.log('Error getting documents', err)
      })
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
              this.currentPeerUser = item.data()
              this.getListHistory()
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

  renderChatBoard = () => {
    return (
      <div className="viewChatBoard">
        {/* Header */}
        <div className="headerChatBoard">
          <img
            className="viewAvatarItem"
            src={this.currentPeerUser.photoUrl}
            alt="icon avatar"
          />
          <span className="textHeaderChatBoard">
            {this.currentPeerUser.nickname}
          </span>
        </div>

        {/* List message */}
        <div className="viewListContentChat">{this.renderListMessage()}</div>

        {/* View bottom */}
        <div className="viewBottom">
          <img
            className="icOpenGallery"
            src={images.ic_photo}
            alt="icon open gallery"
          />
          <img
            className="icOpenSticker"
            src={images.ic_sticker}
            alt="icon open sticker"
          />
          <input className="viewInput" placeholder="Type your message..." />
          <img className="icSend" src={images.ic_send} alt="icon send" />
        </div>

        {/* Loading */}
        {this.state.isLoadHistory ? (
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

  renderListMessage = () => {
    if (this.listMessage.length > 0) {
      let viewListMessage = []
      this.listMessage.forEach((item, index) => {
        if (item.idFrom === this.currentUserId) {
          // Item right (my message)
          if (item.type === 0) {
            viewListMessage.push(
              <div className="viewItemRight" key={item.timestamp}>
                <span className="textContentItem">{item.content}</span>
              </div>
            )
          } else if (item.type === 1) {
            viewListMessage.push(
              <div className="viewItemRight2" key={item.timestamp}>
                <img
                  className="imgContentItem"
                  src={item.content}
                  alt="content message"
                />
              </div>
            )
          } else {
            viewListMessage.push(
              <div className="viewItemRight2" key={item.timestamp}>
                <img
                  className="imgContentItem"
                  src={this.getGifImage(item.content)}
                  alt="content message"
                />
              </div>
            )
          }
        } else {
          // Item left (peer message)
          if (item.type === 0) {
            viewListMessage.push(
              <div className="viewWrapItemLeft" key={item.timestamp}>
                <div className="viewItemLeft">
                  <span className="textContentItem">{item.content}</span>
                </div>
                {this.isLastMessageLeft(index) ? (
                  <span className="textTimeLeft">
                    {moment(Number(item.timestamp)).format('ll')}
                  </span>
                ) : null}
              </div>
            )
          } else if (item.type === 1) {
            viewListMessage.push(
              <div className="viewWrapItemLeft2" key={item.timestamp}>
                <div className="viewItemLeft2">
                  <img
                    className="imgContentItem"
                    src={item.content}
                    alt="content message"
                  />
                </div>
                {this.isLastMessageLeft(index) ? (
                  <span className="textTimeLeft">
                    {moment(Number(item.timestamp)).format('ll')}
                  </span>
                ) : null}
              </div>
            )
          } else {
            viewListMessage.push(
              <div className="viewWrapItemLeft2" key={item.timestamp}>
                <div className="viewItemLeft2" key={item.timestamp}>
                  <img
                    className="imgContentItem"
                    src={this.getGifImage(item.content)}
                    alt="content message"
                  />
                </div>
                {this.isLastMessageLeft(index) ? (
                  <span className="textTimeLeft">
                    {moment(Number(item.timestamp)).format('ll')}
                  </span>
                ) : null}
              </div>
            )
          }
        }
      })
      return viewListMessage
    } else {
      return null
    }
  }

  renderWelcomeBoard = () => {
    return (
      <div className="viewWelcomeBoard">
        <span className="textTitleWelcome">{`Welcome, ${
          this.currentUserNickname
        }`}</span>
        <img
          className="avatarWelcome"
          src={this.currentUserAvatar}
          alt="icon avatar"
        />
        <span className="textDesciptionWelcome">
          Let's start talking. Great things might happen.
        </span>
      </div>
    )
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
            {this.currentPeerUser
              ? this.renderChatBoard()
              : this.renderWelcomeBoard()}
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

  hashString = str => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash += Math.pow(str.charCodeAt(i) * 31, str.length - i)
      hash = hash & hash // Convert to 32bit integer
    }
    return hash
  }

  getGifImage = value => {
    switch (value) {
      case 'mimi1':
        return images.mimi1
      case 'mimi2':
        return images.mimi2
      case 'mimi3':
        return images.mimi3
      case 'mimi4':
        return images.mimi4
      case 'mimi5':
        return images.mimi5
      case 'mimi6':
        return images.mimi6
      case 'mimi7':
        return images.mimi7
      case 'mimi8':
        return images.mimi8
      case 'mimi9':
        return images.mimi9
      default:
        return null
    }
  }

  isLastMessageLeft(index) {
    if (
      (index + 1 < this.listMessage.length &&
        this.listMessage[index + 1].idFrom === this.currentUserId) ||
      index === this.listMessage.length - 1
    ) {
      return true
    } else {
      return false
    }
  }

  isLastMessageRight(index) {
    if (
      (index + 1 < this.listMessage.length &&
        this.listMessage[index + 1].idFrom !== this.currentUserId) ||
      index === this.listMessage.length - 1
    ) {
      return true
    } else {
      return false
    }
  }
}

export default withRouter(Main)
