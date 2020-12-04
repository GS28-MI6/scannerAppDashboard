import { LOGIN_USER, LIST_USERS, LOGIN_ERR, FETCH_CART, FETCH_TOTAL} from '../actions/types';

const initialState = {
  loginErr: {},
  currentUser: {},
  users: [],
  carrito: [],
  total: 0.00
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOGIN_USER:
      return{
        ...state,
        currentUser: action.payload
      };
      case LIST_USERS:
        return{
          ...state,
          users: action.payload
        };
      case FETCH_CART:
        return{
          ...state,
          carrito: action.payload,
        };
      case FETCH_TOTAL:
        return{
          ...state,
          total: action.payload,
        };
      case LOGIN_ERR:
        return{
          ...state,
          loginErr: action.payload
        }
    default:
      return state;
  }
}