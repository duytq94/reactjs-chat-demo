import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { myFirebase } from '../../Config/MyFirebase';
import images from '../Themes/Images';
import './Main.css';

class Main extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      isOpenDialogConfirmLogout: false,
    }
  }

  onLogoutPress = () => {
    this.setState({
      isOpenDialogConfirmLogout: true
    })
  }

  doLogout = () => {
    this.setState({ isLoading: true })
    myFirebase.auth().signOut().then(() => {
      this.setState({ isLoading: false })
      this.props.showToast(1, 'Logout success')
      this.props.history.push('/')
    }).catch(function (err) {
      this.setState({ isLoading: false })
      this.props.showToast(0, err.message)
    });
  }

  hideDialogConfirmLogout = () => {
    this.setState({
      isOpenDialogConfirmLogout: false
    })
  }

  render() {
    return (
      <div className="root">
        <div className='header'>
          MAIN
          <img className='icLogout' alt={'An icon logout'} src={images.ic_logout} onClick={this.onLogoutPress} />
        </div>

        {this.state.isOpenDialogConfirmLogout ?
          <div className='viewCoverScreen'>
            {this.renderDialogConfirmLogout()}
          </div> :
          null
        }

      </div>
    );
  }

  renderDialogConfirmLogout = () => {
    return (
      <div>
        <div className='titleDialogConfirmLogout'>
          Are you sure to logout?
        </div>
        <div className='viewWrapButtonDialogConfirmLogout'>
          <button
            className='btnYes'
            onClick={this.doLogout}
          >YES</button>
          <button
            className='btnNo'
            onClick={this.hideDialogConfirmLogout}
          >CANCEL</button>
        </div>
      </div>
    )
  }
}

export default withRouter(Main);
