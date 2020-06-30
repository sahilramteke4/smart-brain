import React, {Component} from 'react';
import './App.css';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';

const particleOptions = {
                          particles: {
                          number: {
                          value: 100,
                          density: {
                          enable: true,
                          value_area: 800
                        }
                       }
                    }
                  }

const initialState = {
        input: '',
        imageUrl: '',
        box: {},
        route: 'signin',
        isSignedIn: false,
        user: {
          id: ' ',
          name: ' ',
          email: ' ',
          entries: 0,
          joinedDate: ' '
        }
      }

class App extends Component {

    constructor() {
      super();
      this.state = initialState;
    }

    calculateFaceLoction = (data) => {
        const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputImage');
        const width = image.width;
        const height = image.height;
        return {
          leftCol: clarifaiFace.left_col * width,
          topRow: clarifaiFace.top_row * height,
          rightCol: width - (clarifaiFace.right_col * width),
          bottomRow: height - (clarifaiFace.bottom_row * height)
        }
    }

    displayFaceBox = (box) => {
      this.setState({box: box});
    }

    onInputChange = (event) => {
      this.setState({input: event.target.value});
    }

  onButtonSubmit = () => {
      this.setState({imageUrl: this.state.input});
      fetch('https://salty-shelf-34577.herokuapp.com/imageUrl' , {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              input: this.state.input
            })
        })
      .then(response => response.json())
      .then(response => {
        if(response) {
          fetch('https://salty-shelf-34577.herokuapp.com/image' , {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(entries => {
            this.setState(Object.assign(this.state.user, {entries: entries}));
          })
          .catch(err => console.log);
        }
        this.displayFaceBox( this.calculateFaceLoction(response) ) 
      })
      .catch(err => console.log(err));
  }

 onRouteChange = (route) => {
    if(route === 'home') {
      this.setState({isSignedIn: true});
    } else if(route === 'signout') {
      this.setState(initialState);
    }
    this.setState({route: route});
 }

 loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joinedDate: data.joinedDate
      }
    });
 }


  render() {
      const { isSignedIn,  imageUrl, box } = this.state;
        return (
          <div className="App">
                <Particles className='particles' params={particleOptions} />
                <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} />
                { this.state.route === 'home'
                ?  <div>
                      <Logo />
                      <Rank name={ this.state.user.name } entries={ this.state.user.entries } />
                      <ImageLinkForm 
                      onInputChange={this.onInputChange}  
                      onButtonSubmit={this.onButtonSubmit} 
                      /> 
                      <FaceRecognition box={box}  imageUrl={imageUrl} />
                    </div> 
                :   (
                    this.state.route === 'register'
                    ? <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                    : <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                  )
                }
          </div>
        );
      }
}

export default App;
