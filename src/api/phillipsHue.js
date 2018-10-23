const config = require("../config");

const getGroupsUrlWithUsername = () => {
    return config.apiUrl + '/api/' + config.username + '/groups';
} 

const getLightsUrlWithUsername = () => {
    return config.apiUrl + '/api/' + config.username + '/lights';
}

const fetchGroups = async () => {
    let groupsUrl = getGroupsUrlWithUsername();

    const r = await fetch(groupsUrl)
        .then(response => {
            if (!response.ok) {
                throw Error('Network request failed');
            }    
            return response;
        })
        .then(d => d.json())
        .then(d => {
            return {
                groupData: d,
                requestFailed: false
            }
        }, () => {
            return {
                groupData: null,
                requestFailed: true
            }
        });      
    return r;
}

const updateGroup = async( id, bodyData ) => {
    let groupsUrl = getGroupsUrlWithUsername() + '/' + id + '/action';

    const r = await fetch(groupsUrl, { method: 'PUT', body: bodyData })
        .then(response => {
            if (!response.ok) {
                throw Error('Network request failed');
            }
            return response;
        })
        .then(d => d.json())
        .then(d => {
            return {
                requestFailed: false
            };
        }, () => {
            return {
                requestFailed: true
            };
        });
    return r;
}

const toggleGroup = async( id, isOn = 0 ) => {
    return updateGroup( id, '{"on":' + !isOn + '}' );
}

const filterLights = ( lights, includesLights ) => {
    if ( !includesLights ) {
        return lights;
    }
    let filteredLights = {};
    Object.keys( lights ).forEach( (id) => {
        if ( includesLights.includes( id ) ) {
            filteredLights[ id ] = lights[ id ];
        }
    } );
    return filteredLights;
}

const fetchLights = async( includesLights ) => {
    let lightsUrl = getLightsUrlWithUsername();

    const r = await fetch(lightsUrl)
        .then(response => {
            if (!response.ok) {
                throw Error('Network request failed');
            }    
            return response;
        })
        .then(d => d.json())
        .then(d => {
            return {
                lightData: filterLights( d, includesLights ),
                requestFailed: false
            }
        }, () => {
            return {
                lightData: null,
                requestFailed: true
            }
        }); 
    return r;
}

const updateLight = async( id, bodyData ) => {
    let lightsUrl = getLightsUrlWithUsername() + '/' + id + '/state';

    const r = await fetch(lightsUrl, { method: 'PUT', body: bodyData })
        .then(response => {
            if (!response.ok) {
                throw Error('Network request failed');
            }
            return response;
        })
        .then(d => d.json())
        .then(d => {
            return {
                requestFailed: false
            };
        }, () => {
            return {
                requestFailed: true
            };
        });
    return r;
}

const toggleLight = async( id, isOn = 0 ) => {
    return updateLight( id, '{"on":' + !isOn + '}' );
}

const alertLight = async( id ) => {
    await updateLight(id, '{"alert":"select"}');
    setTimeout(function(){ 
        updateLight(id, '{"alert":"none"}');
    }, 10000);    
}

const changeLightBrightness = async( id, newValue ) => {
    await updateLight( id, '{"bri":' + newValue + '}' );
}

export default( {
    groupsUrl: getGroupsUrlWithUsername,
    lightsUrl: getLightsUrlWithUsername,
    fetchGroups,
    toggleGroup, 
    fetchLights, 
    toggleLight, 
    alertLight, 
    changeLightBrightness
} );