import { createActions, createReducer } from 'reduxsauce';

/**
 * Action types & Creators
 */
export const { Types, Creators } = createActions({
    editarSegurancaServico: ['id'],
});

/**
 * Handlers
 */
const INITIAL_STATE = {
    id: 0
};

const editar = (state = INITIAL_STATE, action) => {
    return {
        ...state,
        id: action.id,  
    }
};

/**
 * Reducer
 */
export default createReducer(INITIAL_STATE, {
    [Types.EDITAR_SEGURANCA_SERVICO]: editar,
});