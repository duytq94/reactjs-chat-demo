import React, { Component } from 'react';
import './Root.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Login from '../Login/Login'
import Main from '../Main/Main'

class Root extends Component {

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path='/' component={Login} />
                    <Route path='/main' component={Main} />
                </Switch>
            </BrowserRouter>
        )
    }
}

export default Root