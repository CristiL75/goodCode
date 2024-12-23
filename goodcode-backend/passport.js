const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; // Asigură-te că această linie apare o singură dată.
const User = require('./models/User'); // Asigură-te că calea este corectă
const bcrypt = require('bcrypt');

// Configurează strategia locală
passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const user = await User.findOne({ username });
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

// Serializarea utilizatorului
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserializarea utilizatorului
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});
