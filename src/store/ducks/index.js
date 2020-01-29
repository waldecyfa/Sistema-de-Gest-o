import { combineReducers } from "redux";

import autenticacao from "./autenticacao";

import escalacaoLocalOperacao from "./escalacaoLocalOperacao";

import navegacao from "./navegacao";

import requisicao from "./requisicao";
import requisicaoModelo from "./requisicaoModelo";

import segurancaFuncao from "./segurancaFuncao";
import segurancaMenu from "./segurancaMenu";
import segurancaModelo from "./segurancaModelo";
import segurancaPerfil from "./segurancaPerfil";
import segurancaServico from "./segurancaServico";
import segurancaUsuario from "./segurancaUsuario";

export default combineReducers({
    autenticacao,

    escalacaoLocalOperacao,
    
    navegacao,

    requisicao,
    requisicaoModelo,

    segurancaFuncao,
    segurancaMenu,
    segurancaModelo,
    segurancaPerfil,
    segurancaServico,
    segurancaUsuario
});