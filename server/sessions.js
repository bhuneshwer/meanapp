(function () {

    var session = require('express-session');

    function initSessionStore(app) {
        return new Promise((resolve, reject) => {
            getSessionStore().then((sessionStore) => {
                if (sessionStore) {
                    // We need to trust proxies. This is because the SSL may be terminated 
                    // at ELB or NGINX. Express JS thinks we are running on http
                    // But nginx / ELB knows we are sending via https. 
                    // If the below is not included, since the cookie is "secure = true"
                    // it will not go out
                    app.set("trust proxy", 1);
                    var cookieName = process.env.cookie_name;
                    if (!cookieName) {
                        cookieName = 'cih.dflt.sid';
                    }
                    var cookieOptions = {
                        secret: 'C@ZOsUxc$-$123',
                        proxy: true,
                        name: cookieName,
                        resave: false,
                        saveUninitialized: false,
                        store: sessionStore,
                        cookie : {
                            maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
                            secure: true,
                            sameSite : 'none'
                        }

                    }

                    if (!(app.get('env') === 'production') || process.env.NODE_ENV==="dev") {
                        delete cookieOptions.cookie.secure;
                        delete cookieOptions.cookie.sameSite;
                    }
                    var cookieParser = require('cookie-parser');
                    app.use(cookieParser());

                    app.use(session(cookieOptions));


                    resolve()
                }
            }, (err) => {
                reject(err);
            })
        })


    }

    function getSessionStore() {
        let cacheManager = process.env.CACHE_MANAGER || "mongodb";
        var Caching = new(require("lvtd-lib").Caching)({
            /*port,host,password*/
        })
        console.warn(`${cacheManager} is being used as cache manager for session storage.`);
        return new Promise((resolve, reject) => {
            if (cacheManager == "mongodb") {
                var DbUrl = process.env.DB_URL;
                if (!DbUrl) {
                    DbUrl = "mongodb://dev_rw_user:tS82$&BxyL16@bitnami-mongodb-f1a1-ip.australiaeast.cloudapp.azure.com/engauge_dev?authSource=engauge_dev"
                }
                var MongoDBStore = require('connect-mongodb-session')(session);

                var sessionStore = new MongoDBStore({
                    uri: DbUrl,
                    collection: 'csiSessions'
                });
                sessionStore.on('error', function (error) {
                    console.error(`Error while setting session store ${error.toString()}`);
                });
                resolve(sessionStore);

            } else if (cacheManager == "redis") {
                var RedisStore = require('connect-redis')(session);
                Caching.getRedisClient().then((redisClient) => {
                    var sessionStore = new RedisStore({
                        client: redisClient
                    });
                    resolve(sessionStore)
                });
            }
        })
    }
    exports.initSessionStore = initSessionStore;
})()