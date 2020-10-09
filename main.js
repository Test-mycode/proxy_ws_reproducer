const {Client} = require('undici')
const {createServer} = require('http')
const WebSocket = require('ws')
const proxy = require('./proxy')
const proxyClient = new Client("http://localhost:80")

const server = createServer((req, res) => {
    res.writeHead(200, {
        "content-type": "application/json"
    }).end(JSON.stringify({
        code: 200,
        message: null,
        data: null
    }))
});

const ws = new WebSocket.Server({
    server
})

ws.on("connection", client => {
    client.on("message", msg => {
        client.send(msg)
    })
})

server.listen(80)

const proxyServer = createServer((req, res) => {
    proxy({
        req, res, socket: null, head: null
    }, proxyClient).catch()
}).on('upgrade', (req, socket, head) => {
    proxy({
        req,
        res: null,
        socket,
        head
    }, proxyClient).catch()
}).listen(81)

function test(url) {
    const client = new WebSocket(url)
    client.on("open", () => {
        client.send("test")
    })
}

//direct connect
// test("ws://localhost")

//proxy connect
test("ws://localhost:81")