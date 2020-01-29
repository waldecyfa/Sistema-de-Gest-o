import { createActions, createReducer } from 'reduxsauce';

/**
 * Action types & Creators
 */
export const { Types, Creators } = createActions({
    editarSegurancaUsuario: ['username'],
});

/**
 * Handlers
 */
const INITIAL_STATE = {
    username: ''
};

const editar = (state = INITIAL_STATE, action) => {
    
    return {
        ...state,
        username: action.username,  
    }
};

/**
 * Reducer
 */
export default createReducer(INITIAL_STATE, {
    [Types.EDITAR_SEGURANCA_USUARIO ]: editar,
});