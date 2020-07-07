export default {
    swagger: {
        options: {
            cors: true,
            securityDefinitions: {
                'basic': {
                    'type': 'basic',
                    'name': 'Authorization',
                    'in': 'header'
                }
            },
            security: [{ 'basic': [] }],
            info: {
                title: 'API Documentation',
                version: 'v1.0.0',
                contact: {
                    name: 'John doe',
                    email: 'johndoe@johndoe.com',
                },
            },
            grouping: 'tags',
            sortEndpoints: 'ordered',
        },
    },
    status: {
        options: {
            path: '/status',
            title: 'API Monitor',
            routeConfig: {
                auth: false,
            },
        },
    },
};