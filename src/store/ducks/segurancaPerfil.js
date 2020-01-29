import { createActions, createReducer } from 'reduxsauce';

/**
 * Action types & Creators
 */
export const { Types, Creators } = createActions({
    editarSegurancaPerfil: ['nome'],
});

/**
 * Handlers
 */
const INITIAL_STATE = {
    nome: ''
};

const editar = (state = INITIAL_STATE, action) => {
    
    return {
        ...state,
        nome: action.nome,  
    }
};

/**
 * Reducer
 */
export default createReducer(INITIAL_STATE, {
    [Types.EDITAR_SEGURANCA_PERFIL]: editar,
});