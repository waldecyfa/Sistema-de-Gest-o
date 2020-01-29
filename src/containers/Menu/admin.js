export default {
    items: [
        {
            title: true,
            name: 'Admin',
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
            //icon: 'fa fa-balance-scale',
        },

        {
            name: 'Escalação',
            url: '/escalacao',
            icon: 'fa fa-ship',
            children: [
                {
                    name: 'Local de Operação',
                    url: '/escalacao/local-operacao',
                    icon: 'fa fa-plus',
                    children: [
                        {
                            name: 'Lista',
                            url: '/escalacao/local-operacao/lista',
                            icon: 'fa fa-list',
                        },
                        {
                            name: 'Novo',
                            url: '/escalacao/local-operacao/novo',
                            icon: 'fa fa-file',
                        },
                    ]
                }
            ]
        },		

		{
            name: 'Jurídico',
            url: '/juridico',
            icon: 'fa fa-balance-scale',
            children: [
                {
                    name: 'Lista',
                    url: '/juridico/processo/lista',
                    icon: 'fa fa-list',
                },
                {
                    name: 'Nova',
                    url: '/juridico/processo/novo',
                    icon: 'fa fa-file',
                },
            ]
        },		

        {
            name: 'Segurança',
            url: '/seguranca',
            icon: 'fa fa-lock',
            children: [
                {
                    name: 'Usuário',
                    url: '/seguranca/usuario',
                    icon: 'fa fa-user',
                    children: [
                        {
                            name: 'Lista',
                            url: '/seguranca/usuario/lista',
                            icon: 'fa fa-list',
                        },
                        {
                            name: 'Novo',
                            url: '/seguranca/usuario/novo',
                            icon: 'fa fa-file',
                        },
                    ]
                },
                {
                    name: 'Perfil',
                    url: '/seguranca/perfil',
                    icon: 'fa fa-users',
                    children: [
                        {
                            name: 'Lista',
                            url: '/seguranca/perfil/lista',
                            icon: 'fa fa-list',
                        },
                        {
                            name: 'Nova',
                            url: '/seguranca/perfil/novo',
                            icon: 'fa fa-file',
                        },
                    ]
                },
                {
                    name: 'Função',
                    url: '/seguranca/funcao',
                    icon: 'fa fa-id-card',
                    children: [
                        {
                            name: 'Lista',
                            url: '/seguranca/funcao/lista',
                            icon: 'fa fa-list',
                        },
                        {
                            name: 'Nova',
                            url: '/seguranca/funcao/novo',
                            icon: 'fa fa-file',
                        },
                    ]
                },
                {
                    name: 'Menu',
                    url: '/seguranca/menu',
                    icon: 'fa fa-bars',
                    children: [
                        {
                            name: 'Lista',
                            url: '/seguranca/menu/lista',
                            icon: 'fa fa-list',
                        },
                        {
                            name: 'Nova',
                            url: '/seguranca/menu/novo',
                            icon: 'fa fa-file',
                        },
                    ]
                },
                {
                    name: 'Modelo',
                    url: '/seguranca/modelo',
                    icon: 'fa fa-cube',
                    children: [
                        {
                            name: 'Lista',
                            url: '/seguranca/modelo/lista',
                            icon: 'fa fa-list',
                        },
                        {
                            name: 'Nova',
                            url: '/seguranca/modelo/novo',
                            icon: 'fa fa-file',
                        },
                    ]
                },
                {
                    name: 'Serviço',
                    url: '/seguranca/servico',
                    icon: 'fa fa-cubes',
                    children: [
                        {
                            name: 'Lista',
                            url: '/seguranca/servico/lista',
                            icon: 'fa fa-list',
                        },
                        {
                            name: 'Nova',
                            url: '/seguranca/servico/novo',
                            icon: 'fa fa-file',
                        },
                    ]
                },
            ]
        },

    ],
};
