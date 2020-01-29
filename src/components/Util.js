export const converteSomenteDataParaBr = (data) => {

    const dataHoraArray = data.split(' ');

    const dataArray = dataHoraArray[0].split('-');

    return dataArray[2] +'/'+ dataArray[1] +'/'+ dataArray[0];
}

export const converteDataParaBr = (data) => {

    const dataArray = data.split('-');

    return dataArray[2] +'/'+ dataArray[1] +'/'+ dataArray[0];
}

export const converteDataParaBd = (data) => {

    const dataArray = data.split('/');

    return dataArray[2] +'-'+ dataArray[1] +'-'+ dataArray[0];
}

export const converteDataHoraParaBd = (dataHora) => {

    const dataHoraArray = dataHora.split(' ');

    const dataArray = dataHoraArray[0].split('/');

    return dataArray[2] +'-'+ dataArray[1] +'-'+ dataArray[0] +' '+ dataHoraArray[1];
}

export const converteDataHoraParaSomenteDataBd = (dataHora) => {

    const dataHoraArray = dataHora.split(' ');

    // const dataArray = dataHoraArray[0].split('/');

    return dataHoraArray[0];
}

export const converteDataHoraSemTimezoneParaBr = (dataHora) => {

    const dataHoraTimeZoneArray = dataHora.split(' ');

    const dataHoraArray = dataHoraTimeZoneArray[1].split('.');

    const dataArray = dataHoraTimeZoneArray[0].split('-');

    return dataArray[2] +'/'+ dataArray[1] +'/'+ dataArray[0] +' '+ dataHoraArray[0];
}

export const getDataAtual = () => {
    var dataCompleta = new Date();

    return dataCompleta.getFullYear() + '-' + ("0" + (dataCompleta.getMonth() + 1)).slice(-2) + '-' + ("0" + dataCompleta.getDate()).slice(-2);
}

export const getDataHoraAtualBr = () => {
    var data = new Date();

    return ("0" + data.getDate()).slice(-2) +'/'+ ("0" + (data.getMonth() + 1)).slice(-2) +'/'+ data.getFullYear() +' '+ data.getHours() +':'+ ("0" + data.getMinutes()).slice(-2) +':'+ ("0" + data.getSeconds()).slice(-2);
}

export const getDataHoraAtualBd = () => {
    var data = new Date();
    
    return  data.getFullYear() +'-'+ ("0" + (data.getMonth() + 1)).slice(-2) +'-'+ ("0" + data.getDate()).slice(-2) +' '+ data.getHours() +':'+ ("0" + data.getMinutes()).slice(-2) +':'+ ("0" + data.getSeconds()).slice(-2);
}

export const converteRequisicaoStatus = (status) => {
    
    switch (status) {
        case "R":
            return "Recebida";
    
        case "C":
            return "Cancelada pelo OGMO-ES";

        case "X":
            return "Cancelada";

        case "G":
            return "Gravada";        

        // case "W":
        //     return "Gravado";
        
        case "E":
            return "Escalada";        
    
        default:
            return "Erro";
    }    
}