import { createActions, createReducer } from 'reduxsauce';

/**
 * Action types & Creators
 */
export const { Types, Creators } = createActions({
  addAutenticacao: ['id', 'login', 'password', 'nome', 'url',],
  removeAutenticacao: [],
});

/**
 * Handlers
 */
const INITIAL_STATE = [{logado: false}];

const add = (state = INITIAL_STATE, action) => [
  ...state,
  { id: action.id,  
    login: action.login, 
    password: action.password, 
    nome: action.nome,
    url: action.url,
    logado: true,
  }
];

const remove = (state = INITIAL_STATE, action) => [
  ...state,
  { id: undefined,  
    login: undefined, 
    password: undefined, 
    nome: undefined,
    url: undefined,
    logado: false,
  }
]

/**
 * Reducer
 */
export default createReducer(INITIAL_STATE, {
    [Types.ADD_AUTENTICACAO]: add,
    [Types.REMOVE_AUTENTICACAO]: remove,
  });