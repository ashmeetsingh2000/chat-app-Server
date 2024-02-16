const express = require('express');
const app = express();
const cors = require('cors')

app.use(cors())

const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const hostname = "127.0.0.1";
const port = 5000;

// chat app local data
var chat_data = new Map();
var chat_members = ['ashmeet', 'shalu', 'ranjana'];
// chat app local data

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // For legacy browser support
}

app.use(cors(corsOptions));

// login check api
app.post('/login', function (req, res) {
    let name_to_check = req.body.username;
    if (chat_members.includes(name_to_check.name.toLowerCase())) {
        res.json({ res: "ok" })
    }
    else {
        res.json({ res: "no" })
    }

})
// login check api

// Get all Previous Messages
app.get('/msj', function (req, res) {

    let res_arr = [];

    for (let key of chat_data.keys()) {
        let json_row = {};
        let data = chat_data.get(key)
        json_row[`name`] = data.name;
        json_row[`msj`] = data.msj;
        json_row[`key`] = data.key;
        res_arr.push(json_row)
    }

    res.json({ chat_data: res_arr })

})
// Get all Previous Messages

// Get current Messages
app.post('/current', function (req, res) {

    let key_tp_check = req.body.key;

    checkfor_newData()
    function checkfor_newData() {
        if (chat_data.size > key_tp_check) {
            let res_arr = [];
            for (let index = key_tp_check; index < chat_data.size; index++) {
                let json_row = {};
                let data = chat_data.get(index + 1)
                json_row[`name`] = data.name;
                json_row[`msj`] = data.msj;
                json_row[`key`] = data.key;
                res_arr.push(json_row)
            }
            res.json({ chat_data: res_arr })
        }
        else {
            setTimeout(() => {
                checkfor_newData()
            }, 500);
        }

    }

})
// Get current Messages

// add new message
app.post('/add_msj', function (req, res) {

    let message_data = req.body.msj_data;

    chat_data.set(message_data.key, {
        name: message_data.name,
        msj: message_data.msg,
        key: message_data.key
    })

    let json_row = {};
    let data = chat_data.get(message_data.key)
    json_row[`name`] = data.name;
    json_row[`msj`] = data.msj;
    json_row[`key`] = data.key;

    res.json({ msj_data: [json_row] })
})
// add new message

// delete all messages
app.delete('/delete', function (req, res) {
    chat_data.clear()
    return res.json({ msj: 'Deleted succcefully' })
})
// delete all messages

// constant loop to maintain a number of messages
setInterval(() => {
    if (chat_data.size >= 500) {
        var keys = Array.from(chat_data.keys()).slice(0, 1);
        keys.forEach(k => chat_data.delete(k));
    }
    else { }
}, 2000);
// constant loop to maintain a number of messages

app.listen(port);

console.log(`Server running at http://${hostname}:${port}/`);