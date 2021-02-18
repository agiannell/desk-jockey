const initialState = {
    user : {},
    userPlaylists : []
}

const SET_USER = 'SET_USER';
const SET_USER_PLAYLISTS = 'SET_USER_PLAYLISTS';

export function setUser(userObj){
    return {
        type: SET_USER,
        payload: userObj
    }
}

export function setUserPlaylists(playlistObj){
    return {
        type: SET_USER_PLAYLISTS,
        payload: playlistObj
    }
}

export default function reducer(state = initialState, action){
    const { type, payload } = action;
    console.log('payload:',payload)
    switch(type){
        case SET_USER:
            return {...state, user: payload}
        case SET_USER_PLAYLISTS:
            return {...state, userPlaylists: payload}
        default:
            return state
    }
}