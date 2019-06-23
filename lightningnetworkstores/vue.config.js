module.exports = {
    pluginOptions: {
        prerenderSpa: {
            registry: undefined,
            //   renderRoutes: [
            //     '/',
            //     '/about',
            //     '/wallets',
            //     '/services',
            //     '/donations',
            //     '/stats'
            //   ],
            useRenderEvent: true,
            headless: true,
            onlyProduction: true
        }
    }
};
