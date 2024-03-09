const User = require('./user.model.js');
const saveUser = (user) => {
    const newUser = new User({
        email:user.email,
        given_name:user.given_name,
        family_name:user.family_name,
        picture:user.picture
    });
    return newUser.save();
}