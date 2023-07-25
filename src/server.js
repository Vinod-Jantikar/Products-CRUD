require('dotenv').config();
const app = require("./index");
const connect = require("./config/db.config");

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    try {
        await connect();
        console.log(`Server started on port ${PORT}`);
    } catch (error) {
        console.log(`Error while starting the server`)
    }
})