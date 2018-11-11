import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import { withRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './Profile.css';

class Profile extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      nickname: localStorage.getItem('nickname'),
      aboutMe: localStorage.getItem('aboutMe'),
      photoUrl: localStorage.getItem('photoUrl'),
    }
  }

  onChangeNickname = (event) => {
    this.setState({ nickname: event.target.value })
  }

  onChangeAboutMe = (event) => {
    this.setState({ aboutMe: event.target.value })
  }

  render() {
    return (
      <div className="root">
        <div className='header'>
          <text>PROFILE</text>
        </div>

        <img className='avatar' alt='Avatar' src={this.state.photoUrl} />
        <text className='textLabel'>Nickname:</text>
        <input className='textInput' value={this.state.nickname} placeholder="Your nickname..."
          onChange={this.onChangeNickname}
        />
        <text className='textLabel'>About me:</text>
        <input className='textInput' value={this.state.aboutMe} placeholder="Tell about yourself..."
          onChange={this.onChangeAboutMe}
        />

        <button
          className='btnUpdate'
          type='submit'
          onClick={this.onLoginPress}
        >UPDATE</button>

        {this.state.isLoading ?
          <div className='viewLoading' >
            <ReactLoading type={'spin'} color={'#203152'} height={'3%'} width={'3%'} />
          </div> :
          null}

      </div>
    );
  }

}

export default withRouter(Profile);
