import React, {Component} from 'react';
import {connect} from 'react-redux';
import {userLoginPost} from './actions/postActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import cx from "classnames";
import "./login.css"
import "./css/ingresoManual.css"

library.add(fas, fab);

class Login extends Component {
  state = {
    email: "",
    password: ""
  }

  constructor(props) {
    super(props);
    var heightHolder = window.innerHeight - 50;
    this.stateHeight = {
      height: window.innerHeight,
      heightHolder: heightHolder
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
   }

   componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    var heightHolder = window.innerHeight - 50;
    this.stateheight = {
      height: window.innerHeight,
      heightHolder: heightHolder
    };
  }


  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault()
    this.props.userLoginPost(this.state)
  }

  render() {

    const errNotification = cx('errNotification', {
      'hide' : this.props.loginErr.error === undefined
    })

    return (
      <div>
        <div className="container" style={{ height: this.stateHeight.heightHolder }}>
            <div className="loginForm">
                <form onSubmit={this.handleSubmit}>
                    <div className="formContainer">
                        <h1>Iniciar sesión</h1>
                        <div className="dataAreas">
                            <div className="faIcon">
                                <FontAwesomeIcon icon="user" style={{display:'flex', flexDirection: 'row'}}/>
                            </div>
                            <input
                                name='email'
                                placeholder='Email'
                                className="dataInput"
                                value={this.state.email}
                                onChange={this.handleChange}
                                />
                        </div>
                        <div className="dataAreas">
                            <div className="faIcon">
                                <FontAwesomeIcon icon="key" style={{display:'flex', flexDirection: 'row'}}/>
                            </div>
                            <input
                                type='password'
                                name='password'
                                className="dataInput"
                                placeholder='Contraseña'
                                value={this.state.password}
                                onChange={this.handleChange}
                                />
                        </div>

                        <input className="submit" type='submit' value="iniciar sesión"/>
                    </div>
                </form>
            </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  loginErr: state.posts.loginErr
})

const mapDispatchToProps = dispatch => ({
  userLoginPost: userInfo => dispatch(userLoginPost(userInfo))
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);