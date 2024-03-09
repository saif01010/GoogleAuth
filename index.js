const {connection} = require('./db');
const app = require('./app');


connection().then(() => {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((err) => {
    console.log(err)
    console.log('Error connecting to the database');
})