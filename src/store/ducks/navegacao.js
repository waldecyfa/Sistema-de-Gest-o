import { createActions, createReducer } from 'reduxsauce';

/**
 * Action types & Creators
 */
export const { Types, Creators } = createActions({
    setNavegacao: [
        'ultimaPagina',
        'tipo'
    ],
});

/**
 * Handlers
 */
const INITIAL_STATE = {
    ultimaPagina: '',
    tipo: ''

};

const setNavegacao = (state = INITIAL_STATE, action) => {
    return {
        ...state,
        ultimaPagina: action.ultimaPagina,  
        tipo: action.tipo, 
    }
};

/**
 * Reducer
 */
export default createReducer(INITIAL_STATE, {
    [Types.SET_NAVEGACAO]: setNavegacao,
});