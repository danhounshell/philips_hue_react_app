import React from 'react';
import Toggle from 'material-ui/Toggle';
import LightsView from './LightsView';

const GroupItem = (props) => (
  <div className='group'>
    <div className="groupHeader">
      <div className='toggle'>
          <Toggle
            toggled={props.isOn}
            label={props.name} 
            onToggle={() => props.onToggleLight(props.id,props.isOn)}
          />
          {props.allOn ? <div className='notice'>All lights are on</div> : <div>&nbsp;</div>}
      </div>
    </div>
    <LightsView lights={props.lights} onStateChanged={props.onStateChanged} />      
  </div>
);

export default GroupItem;
