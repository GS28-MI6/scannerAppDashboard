import { FETCH_POSTS, NEW_POST, NEW_DIR, SELECT_ALERT, LOGIN_USER, COUNT_ALERTS, LIST_USERS, PENDING_USERS, MAP_SHOW, LOGIN_ERR } from '../actions/types';

const initialState = {
  alerts: [],
  alertDataHolder: {},
  direccion: {},
  currentUser: {},
  counts: {},
  users: [],
  pendingUsers: [],
  loginErr: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_POSTS:
      return {
        ...state,
        alerts: action.payload
      };
    case NEW_POST:
      return {
        ...state,
        alerts: action.payloadAlerts,
        alertDataHolder: action.payloadAlert
      };
    case NEW_DIR:
      return {
        ...state,
        direccion: action.payload
      };
    case SELECT_ALERT:
      return{
        ...state,
        alertDataHolder: action.payload
      };
    case LOGIN_USER:
      return{
        ...state,
        currentUser: action.payload
      };
      case COUNT_ALERTS:
        return{
          ...state,
          counts: action.payload
        };
      case LIST_USERS:
        return{
          ...state,
          users: action.payload
        };
      case PENDING_USERS:
        return{
          ...state,
          pendingUsers: action.payload
        };
      case MAP_SHOW:
        return{
          ...state,
          alertDataHolder: action.payload
        }
      case LOGIN_ERR:
        return{
          ...state,
          loginErr: action.payload
        }
    default:
      return state;
  }
}