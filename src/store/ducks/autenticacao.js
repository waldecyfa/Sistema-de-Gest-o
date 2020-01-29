import { createActions, createReducer } from 'reduxsauce';

/**
 * Action types & Creators
 */
export const { Types, Creators } = createActions({
    setToken: [
        'accessToken', 
        'tokenType', 
        'refreshToken', 
        'scope',
    ],
    setUsuarioLogado: [
        'username',
        'perfil',
        'idPessoa',
    ],
    setPessoaLogada: [
        'idPessoaJuridica',
        'nome',
        'nomeCompleto',
        'idOperadorPortuario',
    ],
});

/**
 * Handlers
 */
const INITIAL_STATE = {
    accessToken: '', 
    tokenType: '', 
    refreshToken: '', 
    scope: '',

    username: '',
    perfil: '',
    idPessoa: 0,

    idPessoaJuridica: 0,
    nome: '',
    nomeCompleto: '',
    idOperadorPortuario: 0,
};

const setToken = (state = INITIAL_STATE, action) => {
    return {
        ...state,
        accessToken: action.accessToken, 
        tokenType: action.tokenType, 
        refreshToken: action.refreshToken, 
        scope: action.scope
    }
};

const setUsuarioLogado = (state = INITIAL_STATE, action) => {
    return {
        ...state,
        username: action.username, 
        perfil: action.perfil, 
        idPessoa: action.idPessoa, 
    }
};

const setPessoaLogada = (state = INITIAL_STATE, action) => {
    return {
        ...state,
        idPessoaJuridica: action.idPessoaJuridica, 
        nome: action.nome, 
        nomeCompleto: action.nomeCompleto,
        idOperadorPortuario: action.idOperadorPortuario, 
    }
};

/**
 * Reducer
 */
export default createReducer(INITIAL_STATE, {
    [Types.SET_TOKEN]: setToken,
    [Types.SET_USUARIO_LOGADO]: setUsuarioLogado,
    [Types.SET_PESSOA_LOGADA]: setPessoaLogada,
});