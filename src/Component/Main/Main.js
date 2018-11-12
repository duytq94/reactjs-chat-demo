import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import { myFirebase, myFirestore } from '../../Config/MyFirebase'
import images from '../Themes/Images'
import './Main.css'
import ReactLoading from 'react-loading'

class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      isOpenDialogConfirmLogout: false
    }
    this.listUser = []
  }

  componentDidMount() {
    this.checkLogin()
  }

  checkLogin = () => {
    if (!localStorage.getItem('id')) {
      this.props.history.push('/')
    } else {
      this.getListUser()
    }
  }

  getListUser = async () => {
    const result = await myFirestore.collection('users').get()
    if (result.docs.length > 0) {
      this.listUser = [...result.docs]
      this.setState({})
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
      for (let i = 0; i < this.listUser.length; i++) {
        viewListUser.push(<li>{this.listUser[i].data().nickname}</li>)
      }
      return viewListUser
    } else {
      return null
    }
  }

  render() {
    return (
      <div className="root">
        <div className="header">
          <span>MAIN</span>
          <img
            className="icProfile"
            alt={'An icon default avatar'}
            src={images.ic_default_avatar}
            onClick={this.onProfileClick}
          />
          <img
            className="icLogout"
            alt={'An icon logout'}
            src={images.ic_logout}
            onClick={this.onLogoutClick}
          />
        </div>

        {this.renderListUser()}

        {this.state.isOpenDialogConfirmLogout ? (
          <div className="viewCoverScreen">
            {this.renderDialogConfirmLogout()}
          </div>
        ) : null}

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
