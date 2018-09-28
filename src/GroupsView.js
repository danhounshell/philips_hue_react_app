import React, { Component } from 'react';
import GroupItem from './GroupItem';
import Config from './config';

class GroupsView extends Component {
  constructor(props) {
    super(props);
    this.requestFailed = false;
    this.groupData = null;

    this.onToggleGroup = this.onToggleGroup.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.onGroupBrightnessChanged = this.onGroupBrightnessChanged.bind(this);
    setInterval(this.fetchData,5000);
  }

  componentWillMount() {
    this.fetchData();
  }

  getGroupsUrlWithUsername() {
    return Config.apiUrl + '/api/' + Config.username + '/groups';
  } 

  fetchData() {
    let groupsUrl = this.getGroupsUrlWithUsername();

    fetch(groupsUrl)
      .then(response => {
        if (!response.ok) {
            throw Error('Network request failed');
        }    
        return response;
      })
      .then(d => d.json())
      .then(d => {
        this.groupData = d;
        this.requestFailed = false;
        this.setState({newData:new Date()});
      }, () => {
        this.requestFailed = true;
        this.setState({newData:new Date()});
      })      
  }

  changeGroupState(id, bodyData) {
    let groupsUrl = this.getGroupsUrlWithUsername() + '/' + id + '/action';

    fetch(groupsUrl, { method: 'PUT', body: bodyData })
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

  onToggleGroup(id, isOn) {
    let bodyData = '{"on":' + !isOn + '}';
    this.changeGroupState(id, bodyData);
  }

  onGroupBrightnessChanged(id, newValue) {
    let bodyData = '{"bri":' + newValue + '}';
    this.changeGroupState(id, bodyData);
  }

  render() {
    if (this.requestFailed) {
      let url = this.getLightsUrlWithUsername();
      return <p className='warning'>Could not fetch from {url}</p>
    }

    if (!this.groupData) {
      return <p>Loading...</p>;
    }

    if (this.groupData[0] !== undefined) {
      return <p className='warning'>{this.groupData[0].error.description}</p>;
    }

    let groupData = this.groupData;
    let groupItems = [];
    let groupToggleHandler = this.onToggleGroup;
    let groupBrightnessHandler = this.onGroupBrightnessChanged;
    if ( groupData ) {
        Object.keys(groupData).forEach(function(id) {
            let item = groupData[id];
            let group = <GroupItem key={id} id={id} name={groupData[id].name} 
                        isOn={item.state.all_on || item.state.any_on} bri={item.action.bri} 
                        reachable={true} 
                        onToggleLight={groupToggleHandler}
                        onBrightnessChanged={groupBrightnessHandler}
                        lights={item.lights}/>
            groupItems.push(group);      
        });
    }

    return (
      <div className="groups" align='center' style={{maxWidth:950,margin: '20px auto 0'}}>
          {groupItems}
      </div>
    );
  }
}

export default GroupsView;
