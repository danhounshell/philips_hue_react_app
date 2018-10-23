import React, { Component } from 'react';
import LightItem from './LightItem';
import hueApi from './api/phillipsHue';

class LightsView extends Component {
    constructor(props) {
        super(props);
        this.includesLights =props.includesLights;
        this.requestFailed = false;
        this.lightData = null;

        this.fetchData = this.fetchData.bind(this);
        this.onToggleLight = this.onToggleLight.bind(this);
        this.onAlertLight = this.onAlertLight.bind(this);
        this.onLightBrightnessChanged = this.onLightBrightnessChanged.bind(this);
        this.onStateChanged = props.onStateChanged;
  }

  componentWillMount() {
      this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
      this.fetchData();  
  } 

  getLightsUrl() {
      return hueApi.lightsUrl();
  }

  fetchData() {
      hueApi.fetchLights( this.includesLights )
          .then( d => {
              this.lightData = d.lightData;
              this.requestFailed = d.requestFailed;
              this.setState({newData:new Date()});
          });    
  }

  onToggleLight(id, isOn) {
      hueApi.toggleLight(id, isOn)
          .then(d => {
              this.requestFailed = d.requestFailed;
              this.onStateChanged();
          }, () => {
              this.requestFailed = true;
          });
  }

  onAlertLight(id) {
      hueApi.alertLight(id).then( d => { this.onStateChanged(); } );
  }

  onLightBrightnessChanged(id, newValue) {
      hueApi.changeLightBrightness( id, newValue ).then( d => { this.onStateChanged(); } );
  }

  render() {
      if (this.requestFailed) {
        let url = this.getLightsUrl();
        return <p className='warning'>Could not fetch from {url}</p>
      }

      if (!this.lightData) {
        return <p>Loading...</p>;
      }

      if (this.lightData[0] !== undefined) {
        return <p className='warning'>{this.lightData[0].error.description}</p>;
      }

      let lightData = this.lightData;
      let lightItems = [];
      let lightToggleHandler = this.onToggleLight;
      let lightBrightnessHandler = this.onLightBrightnessChanged;
      let alertHandler = this.onAlertLight;
      Object.keys(lightData).forEach(function(id) {
          let item = lightData[id];
          let light = 
              <LightItem key={id} id={id} name={lightData[id].name} 
                  isOn={item.state.on} bri={item.state.bri} 
                  reachable={item.state.reachable} 
                  isAlert={item.state.alert}
                  onToggleLight={lightToggleHandler}
                  onBrightnessChanged={lightBrightnessHandler}
                  onAlertLight={alertHandler}/>
          lightItems.push(light);
      });

      return (
        <div className="lights" align='center'>    
            {lightItems}
        </div>
      );
  }
}

export default LightsView;
