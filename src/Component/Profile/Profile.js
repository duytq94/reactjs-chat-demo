import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import { withRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import images from './../Themes/Images';
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

	onChangeNickname = event => {
		this.setState({ nickname: event.target.value })
	}

	onChangeAboutMe = event => {
		this.setState({ aboutMe: event.target.value })
	}

	onChangeAvatar = event => {
		if (event.target.files && event.target.files[0]) {
			this.setState({ photoUrl: URL.createObjectURL(event.target.files[0]) })
		} else {
			this.props.showToast(0, 'Something wrong with input file')
		}
	}

	render() {
		return (
			<div className="root">
				<div className="header">
					<span>PROFILE</span>
				</div>

				<img className="avatar" alt="Avatar" src={this.state.photoUrl} />

				<div className="viewWrapInputFile">
					<img className="imgInputFile" alt="icon gallery" src={images.ic_input_file} />
					<input className="viewInputFile" type="file" onChange={this.onChangeAvatar} />
				</div>

				<span className="textLabel">Nickname:</span>
				<input
					className="textInput"
					value={this.state.nickname}
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

				<button className="btnUpdate" type="submit" onClick={this.onLoginPress}>
					UPDATE
				</button>

				{this.state.isLoading ? (
					<div className="viewLoading">
						<ReactLoading type={'spin'} color={'#203152'} height={'3%'} width={'3%'} />
					</div>
				) : null}
			</div>
		)
	}
}

export default withRouter(Profile)
