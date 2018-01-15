module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps : [

        // First application
        {
            name      : "Yomonio",
            script    : "./index.js",
            env: {
                PORT: "3005",
                MONGODB_URI: "mongodb://yomonio-ad:corvettE8@ds251827.mlab.com:51827/yomonio",
                SECRET: "DexIsEenBaasEnLivIsEenBazin",
                KEY: "Dexperts2015"
            }
        }
    ]
};