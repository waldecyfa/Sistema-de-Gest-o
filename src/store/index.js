import { createStore } from "redux";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import reducers from "./ducks";

{/* @Comentar abaixo */}
const persistConfig = {
    key: 'root',
    storage,
};

// Cria a limpeza do Store
const rootReducer = ( state, action ) => {

    if ( action.type === 'SET_LOGOUT' ) {
        state = undefined;
    }
       
    return reducers(state, action)
}

{/* @Comentar abaixo */}
const persistedReducer = persistReducer(persistConfig, rootReducer)
{/* @Descomentar abaixo */}
// const store = createStore(rootReducer)
{/* @Comentar abaixo */}
const store = createStore(persistedReducer)
{/* @Comentar abaixo */}
const persistor = persistStore(store)
{/* @Comentar persistor */}
export {store, persistor};