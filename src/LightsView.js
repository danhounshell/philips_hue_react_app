import React, { Component } from 'react';
import LightItem from './LightItem';
import Config from './config';

class LightsView extends Component {
  constructor(props) {
    super(props);
    this.lights =props.lights;
    this.requestFailed = false;
    this.lightData = null;

    this.onToggleLight = this.onToggleLight.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.onLightBrightnessChanged = this.onLightBrightnessChanged.bind(this);
    setInterval(this.fetchData,30000);
  }

  componentWillMount() {
    this.fetchData();
  }

  getLightsUrlWithUsername() {
    return Config.apiUrl + '/api/' + Config.username + '/lights';
  }

  fetchData() {
    let lightsUrl = this.getLightsUrlWithUsername();

    fetch(lightsUrl)
      .then(response => {
        if (!response.ok) {
            throw Error('Network request failed');
        }    
        return response;
      })
      .then(d => d.json())
      .then(d => {
        this.lightData = d;
        this.requestFailed = false;
        this.setState({newData:new Date()});
      }, () => {
        this.requestFailed = true;
        this.setState({newData:new Date()});
      }) 
  }

  changeLightState(id, bodyData) {
    let lightsUrl = this.getLightsUrlWithUsername() + '/' + id + '/state';

    fetch(lightsUrl, { method: 'PUT', body: bodyData })
      .then(response => {
        if (!response.ok) {
          throw Error('Network request failed');
        }
        return response;
      })
      .then(d => d.json())
      .then(d => {
        this.requestFailed = false;
        this.fetchData();
      }, () => {
        this.requestFailed = true;
      })
  }

  onToggleLight(id, isOn) {
    let bodyData = '{"on":' + !isOn + '}';
    this.changeLightState(id, bodyData);
  }

  onLightBrightnessChanged(id, newValue) {
    let bodyData = '{"bri":' + newValue + '}';
    this.changeLightState(id, bodyData);
  }

  render() {
    if (this.requestFailed) {
      let url = this.getLightsUrlWithUsername();
      return <p className='warning'>Could not fetch from {url}</p>
    }

    if (!this.lightData) {
      return <p>Loading...</p>;
    }

    if (this.lightData[0] !== undefined) {
      return <p className='warning'>{this.lightData[0].error.description}</p>;
    }

    let lightData = this.lightData;
    let groupLights = this.lights;
    let lightItems = [];
    let lightToggleHandler = this.onToggleLight;
    let lightBrightnessHandler = this.onLightBrightnessChanged;
      Object.keys(lightData).forEach(function(id) {
        if ( groupLights && groupLights.includes( id ) ) {
          let item = lightData[id];
          let light = <LightItem key={id} id={id} name={lightData[id].name} 
                      isOn={item.state.on} bri={item.state.bri} 
                      reachable={true} 
                      onToggleLight={lightToggleHandler}
                      onBrightnessChanged={lightBrightnessHandler}/>
          lightItems.push(light);
        }
      });

    return (
      <div className="lights" align='center' style={{width:'100%',margin: '20px auto 0'}}>    
          {lightItems}
      </div>
    );
  }
}

export default LightsView;
