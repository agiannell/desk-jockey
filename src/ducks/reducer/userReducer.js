const initialState = {
    user: {},
    accessToken: null,
    localUser: {},
    roomUsers: []
}

const SET_USER = 'SET_USER';
const CLEAR_USER = 'CLEAR_USER';
const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN';
const CLEAR_ACCESS_TOKEN = 'CLEAR_ACCESS_TOKEN';
const SET_LOCAL_USER = 'SET_LOCAL_USER';
const CLEAR_LOCAL_USER = 'CLEAR_LOCAL_USER';
const SET_ROOM_USERS = 'SET_ROOM_USERS';


export function setUser(userObj) {
    return {
        type: SET_USER,
        payload: userObj
    }
}

export function setAccessToken(accessToken) {
    return {
        type: SET_ACCESS_TOKEN,
        payload: accessToken
    }
}

export function setLocalUser(localObj) {
    return {
        type: SET_LOCAL_USER,
        payload: localObj
    }
}

export function clearUser() {
    return {
        type: CLEAR_USER,
        payload: {}
    }
}

export function clearLocalUser() {
    return {
        type: CLEAR_LOCAL_USER,
        payload: {}
    }
}

export function clearAccessToken() {
    return {
        type: CLEAR_ACCESS_TOKEN,
        payload: null
    }
}

export function setRoomUsers(userObj) {
    return {
        type: SET_ROOM_USERS,
        payload: userObj
    }
}

export default function reducer(state = initialState, action) {
    const { type, payload } = action;
    // console.log('payload:',payload)

    switch (type) {
        case SET_USER:
            return { ...state, user: payload }
        case SET_ACCESS_TOKEN:
            return { ...state, accessToken: payload }
        case CLEAR_ACCESS_TOKEN:
            return { ...state, accessToken: payload }
        case SET_LOCAL_USER:
            return { ...state, localUser: payload }
        case CLEAR_USER:
            return { ...state, user: payload }
        case CLEAR_LOCAL_USER:
            return { ...state, localUser: payload }
        case SET_ROOM_USERS:
            return { ...state, roomUsers: payload }
        default:
            return state
    }
}