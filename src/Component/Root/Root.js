import React, {Component} from 'react'
import './Root.css'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Login from '../Login/Login'
import Main from '../Main/Main'
import Profile from '../Profile/Profile'
import {toast, ToastContainer} from 'react-toastify'

class Root extends Component {
    showToast = (type, message) => {
        // 0 = warning, 1 = success
        switch (type) {
            case 0:
                toast.warning(message)
                break
            case 1:
                toast.success(message)
                break
            default:
                break
        }
    }

    render() {
        return (
            <BrowserRouter>
                <div>
                    <ToastContainer
                        autoClose={2000}
                        hideProgressBar={true}
                        position={toast.POSITION.BOTTOM_RIGHT}
                    />
                    <Switch>
                        <Route
                            exact
                            path="/"
                            render={props => <Login showToast={this.showToast} {...props} />}
                        />
                        <Route
                            exact
                            path="/main"
                            render={props => <Main showToast={this.showToast} {...props} />}
                        />
                        <Route
                            exact
                            path="/profile"
                            render={props => (
                                <Profile showToast={this.showToast} {...props} />
                            )}
                        />
                    </Switch>
                </div>
            </BrowserRouter>
        )
    }
}

export default Root
