export default {
    items: [
        {
            title: true,
            name: 'Operador Portuário',
            wrapper: {            // optional wrapper object
                element: '',        // required valid HTML5 element tag
                attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
            },
            class: ''             // optional class names space delimited list for title item ex: "text-center"
        },
        {
            name: 'Início',
            url: '/inicio',
            icon: 'fa fa-play',
        },

        // {
        //     name: 'PDF',
        //     url: '/pdf',
        //     icon: 'icon-chart',             
        // },

        {
            name: 'Requisição',
            url: '/operador-portuario/requisicao',
            icon: 'fa fa-ship',
            children: [
                {
                    name: 'Pendente',
                    url: '/operador-portuario/requisicao/pendente',
                    icon: 'fa fa-clock-o',
                },
                {
                    name: 'Histórico',
                    url: '/operador-portuario/requisicao/historico',
                    icon: 'fa fa-calendar',
                },
                {
                    name: 'Nova',
                    url: '/operador-portuario/requisicao/novo',
                    icon: 'fa fa-file',
                },
                {
                    name: 'Modelo',
                    url: '/operador-portuario/requisicao/modelo',
                    icon: 'fa fa-heart',
                    children: [
                        {
                            name: 'Lista',
                            url: '/operador-portuario/requisicao/modelo/lista',
                            icon: 'fa fa-list',
                        },
                        {
                            name: 'Nova',
                            url: '/operador-portuario/requisicao/modelo/novo',
                            icon: 'fa fa-file',
                        },
                    ]
                },
            ]
        }, 
        {
            name: 'Relatório',
            url: '/operador-portuario/',
            icon: 'fa fa-line-chart',            
            children: [
                // {
                //     name: 'Consolidação',
                //     url: '/operador-portuario/filtrarRelatorioConsolidacao',
                //     icon: 'fa fa-table',
                //     badge: {
                //         variant: 'info',
                //         text: 'BREVE',
                //     },
                // },
                {
                    name: 'Folha de Pagamento',
                    url: '/operador-portuario/relatorio/folha-pagamento/filtro',
                    icon: 'fa fa-table',
                    // badge: {
                    //     variant: 'info',
                    //     text: 'BREVE',
                    // },
                },
                {
                    name: 'MODELO FPG',
                    url: '/operador-portuario/relatorio/folha-pagamento/modelo',
                    icon: 'fa fa-table',
                    // badge: {
                    //     variant: 'info',
                    //     text: 'BREVE',
                    // },
                },

                {
                    name: 'Estatistica',
                    url: '/operador-portuario/relatorio/estatistica/filtro',
                    icon: 'fa fa-table',
                    // badge: {
                    //     variant: 'info',
                    //     text: 'BREVE',
                    // },
                },

                {
                    name: 'MODELO EST',
                    url: '/operador-portuario/relatorio/estatistica/modelo',
                    icon: 'fa fa-table',
                    // badge: {
                    //     variant: 'info',
                    //     text: 'BREVE',
                    // },
                },
            ]
        }, 
    ],
};
