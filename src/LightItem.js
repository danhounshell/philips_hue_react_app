import React from 'react';
import Toggle from 'material-ui/Toggle';
import Slider from 'material-ui/Slider';

const LightItem = (props) => (
  <div className='light items'>
    <div className='item toggle'>
        <Toggle
          toggled={props.isOn}
          label={props.name} 
          onToggle={() => props.onToggleLight(props.id,props.isOn)}
          disabled={!props.reachable}
        />
        {props.reachable ? '' : <div className='warning'>not reachable</div>}
        {props.isAlert !== 'none' ? <div className='warning'>ALERT</div> : ''}
    </div>
    {props.reachable ? 
      <div className='item slider'>
        <Slider
          min={0}
          max={255}
          step={1}
          value={props.bri}
          onChange={(event,newValue) => props.onBrightnessChanged(props.id,newValue)}     
        />
        <div><button className="warning" onClick={() => props.onAlertLight(props.id) }>Send Alert</button></div>        
      </div> : '' }
  </div>
);

export default LightItem;
