import React from 'react';
import ReactDOM from 'react-dom';
import { Nav, Navbar, Dropdown, ButtonGroup, NavItem, Link, Brand, Button, FormControl, Form } from 'react-bootstrap';
import axios from 'axios';
import {
  getFromStorage,
  setInStorage
} from '../../utils/storage'
import { withRouter } from 'react-router-dom';
import './style.css';

var Router = require('react-router');



class NavBarComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      songs: [],
      songJSON: []
    }
  }

  componentDidMount() {
    var token = getFromStorage('bach2basics')
    if (token) {
      console.log("Token Exists - checking")
      fetch('https://elegant-bastille-67491.herokuapp.com/api/account/verify?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            console.log("here is json")
            console.log(json)
            this.setState({
              token,
              userId: json.userId,
              username: json.username,
              isLoading: false
            })
            /*
            this.setState(state => {
              const list = state.songs.concat("abcdefg");

              return {
                list
              };
            });
            */
            json.songs.forEach((item, index) => {
              let x = this.state.songs.concat(item.songId)
              let y = this.state.songJSON.concat(item.songJSONString)
              this.setState({ songs: x });
              this.setState({ songJSON: y })
              console.log(item.songId)
              console.log(item.songJSONString)
            })

          }
          else {
            console.log('invalid token')
            this.props.history.push('/login')
          }
        })
    } else {
      console.log("no token found")
      this.setState({
        isLoading: false,
      })
    }
  }

  logout(e) {
    var token = getFromStorage('bach2basics')
    console.log(token)
    axios.get('https://elegant-bastille-67491.herokuapp.com/api/account/logout?token=' + token)
      .then(response => {
        console.log(response)
        if (response.data) {
          console.log('successful logout')
          setTimeout(() => { this.props.history.push('/login') }, 50)
        } else {
          console.log('Sign-up error')
        }
      }).catch(error => {
        console.log('Signup server error: ')
        console.log(error)
      })
  }

  handleSaveToPC = index => {
    const fileData = JSON.parse(this.state.songJSON[index]);
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = this.state.songs[index] + ".xml";
    link.href = url;
    link.click();
  }





  render() {
    return (
      <>
        <Navbar sticky="top" bg="dark" variant="dark">
          <Navbar.Brand href="/">
            <img
              src="/images/logo3.png"
              height="35"
              className="d-inline-block align-top"
              alt="Bach to Basics Logo"
            />
          </Navbar.Brand>
          <Nav className="justify-content-end">
            <Button className="myNavLinks" variant="dark" href="/">Home</Button>
            <Dropdown as={ButtonGroup}>
              <Button className="myNavLinks" variant="dark" href="/demo">Practice</Button>
              <Dropdown.Toggle className="myNavLinks" split variant="dark" id="dropdown-split-basic" />
              <Dropdown.Menu>
                {this.state.songs.map((item, index) => {
                  return (
                    <Dropdown.Item>{item}</Dropdown.Item>
                  )
                })}

              </Dropdown.Menu>
            </Dropdown>
            <Dropdown as={ButtonGroup}>
              <Button className="myNavLinks" variant="dark" href="/composition">Compose</Button>
              <Dropdown.Toggle className="myNavLinks" split variant="dark" id="dropdown-split-basic" />
              <Dropdown.Menu>
                {this.state.songs.map((item, index) => {
                  return (
                    <Dropdown.Item onClick={this.handleSaveToPC.bind(this, index)}>{item}</Dropdown.Item>
                  )
                })}

              </Dropdown.Menu>
            </Dropdown>
            <Button className="myNavLinks" variant="dark" onClick={this.logout.bind(this)}>Logout</Button>
            <Navbar.Collapse className="usertext">
              <Navbar.Text className="myNavLinks">
                Welcome, {this.state.username}
              </Navbar.Text>
            </Navbar.Collapse>
          </Nav>

        </Navbar>
      </>
    )
  }
}

export default withRouter(NavBarComponent);
