const initialState = {
    user: {},
    userPlaylists: [],
    accessToken: null
}

const SET_USER = 'SET_USER';
const SET_USER_PLAYLISTS = 'SET_USER_PLAYLISTS';
const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN';

export function setUser(userObj) {
    return {
        type: SET_USER,
        payload: userObj
    }
}

export function setUserPlaylists(playlistObj) {
    return {
        type: SET_USER_PLAYLISTS,
        payload: playlistObj
    }
}

export function setAccessToken(accessToken) {
    return {
        type: SET_ACCESS_TOKEN,
        payload: accessToken
    }
}

export default function reducer(state = initialState, action) {
    const { type, payload } = action;
    // console.log('payload:',payload)

    switch (type) {
        case SET_USER:
            return { ...state, user: payload }
        case SET_USER_PLAYLISTS:
            return { ...state, userPlaylists: payload }
        case SET_ACCESS_TOKEN:
            return { ...state, accessToken: payload }
        default:
            return state
    }
}