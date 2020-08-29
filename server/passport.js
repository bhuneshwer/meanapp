(function() {

    var configure = (app) => {
        try {
            const bcrypt = require('bcrypt');
            const passport = require('passport'),
                LocalStrategy = require('passport-local').Strategy,

                const localStrategy = new LocalStrategy({
                    usernameField: 'email',
                    passwordField: 'password',
                }, (email, password, done) => {
                    console.warn("called local strategy", email, password);
                    getUserByEmail(email.toLocaleLowerCase(), (err, user) => {
                        if (err) {
                            return done(err);
                        }
                        if (!user) {
                            return done(null, false, {
                                msg: `Email ${email} not found.`
                            });
                        }
                        var isPasswordCorrect = bcrypt.compareSync(password, user.password);
                        if (isPasswordCorrect) {
                            return done(null, user);
                        } else {
                            return done(null, false, {
                                msg: 'Invalid email or password.'
                            });
                        }
                    });
                })

            /**
             * Sign in using Email and Password.
             * 
             */

            passport.use(localStrategy);

            passport.use(auth0Strategy)


            passport.serializeUser((user, done) => {
                //delete user['password'];
                done(null, user);
            });

            passport.deserializeUser((user, done) => {
                //delete user['password'];
                done(null, user);
            });



            app.use(passport.initialize());
            app.use(passport.session());

        } catch (e) {
            console.error(e);
        }
    }

    function getUserByEmail(email, cb) {
        cb(null, null);
    }

    /**
     * Login Required middleware.
     */
    exports.isAuthenticated = (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login');
    };

    exports.configure = configure;
})()