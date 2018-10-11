import React from 'react';
import Toggle from 'material-ui/Toggle';
import Slider from 'material-ui/Slider';
import LightsView from './LightsView';

const GroupItem = (props) => (
  <div className='group items'>
    <div className="groupHeader">
      <div className='item toggle'>
          <Toggle
            toggled={props.isOn}
            label={props.name} 
            onToggle={() => props.onToggleLight(props.id,props.isOn)}
          />
          {props.allOn ? <div className='notice'>All lights are on</div> : <div>&nbsp;</div>}
      </div>
        <div className='item slider'>
          <Slider
            min={0}
            max={255}
            step={1}
            value={props.bri}
            onChange={(event,newValue) => props.onBrightnessChanged(props.id,newValue)}     
          />
        </div>
    </div>
    <LightsView lights={props.lights} onStateChanged={props.onStateChanged} />      
  </div>
);

export default GroupItem;
