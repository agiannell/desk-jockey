import { createStore, combineReducers } from 'redux';
import userReducer from './reducer/userReducer';

const rootReducer = combineReducers({
    userReducer: userReducer

})

export default createStore(rootReducer)