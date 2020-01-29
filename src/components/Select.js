/********************
 ********* VALIDAÇÃO
 */

export const getEstiloInvalido = () => {
    return {
        control: styles => ({ 
            ...styles, 
            backgroundColor: 'white',
            borderColor: '#f86c6b',
            // webkitBoxShadow: '0 0 0 0.2rem rgba(248, 108, 107, 0.25)',
            // boxShadow: '0 0 0 0.2rem rgba(248, 108, 107, 0.25)',
        }),
    }
}

export const getEstiloValido = () => {
    return {
        control: styles => ({ 
            ...styles, 
            backgroundColor: 'white',
            borderColor: '#4dbd74',
            // webkitBoxShadow: '0 0 0 0.2rem rgba(77, 189, 116, 0.25);',
            // boxShadow: '0 0 0 0.2rem rgba(77, 189, 116, 0.25);',
        }),
    }
}

export const getEstiloInvalidoEsocial = () => {
    return {
        control: styles => ({ 
            ...styles, 
            backgroundColor: '#c0dcc0',
            borderColor: '#f86c6b',
            // webkitBoxShadow: '0 0 0 0.2rem rgba(248, 108, 107, 0.25)',
            // boxShadow: '0 0 0 0.2rem rgba(248, 108, 107, 0.25)',
        }),
    }
}

export const getEstiloValidoEsocial = () => {
    return {
        control: styles => ({ 
            ...styles, 
            backgroundColor: '#c0dcc0',
            borderColor: '#4dbd74',
            // webkitBoxShadow: '0 0 0 0.2rem rgba(77, 189, 116, 0.25);',
            // boxShadow: '0 0 0 0.2rem rgba(77, 189, 116, 0.25);',
        }),
    }
}

export const getEstiloNormal = () => {
    return {
        control: styles => ({ 
            ...styles,            
            backgroundColor: '#f2f2f2',
            borderColor: '#c8ced3',
        }),
    }
}