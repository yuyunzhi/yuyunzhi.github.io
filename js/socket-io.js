import SocketIO from 'socket.io-client'

// 心跳检测
const heartCheck = (socket, userId) => {
    let timeout = 0

    window.setInterval(() => {
        if (timeout <= 0) {
            socket.emit('refresh', { userId })
            timeout = 30
        } else {
            timeout--
        }
    }, 1000)
}

function SocketIOClient (url, userId, token) {
    const socket = SocketIO(url, {
        transports: ['websocket', 'polling', 'flashsocket']
    })

    this.url = url
    this.userId = userId
    this.token = token
    this.socket = socket
}

// 打开连接&发送握手事件
SocketIOClient.prototype.openConnect = function () {
    const socket = this.socket
    const userId = this.userId
    const token = this.token

    socket.on('connect', () => {
        heartCheck(socket, userId)

        // 发送握手事件
        socket.emit('handshake', { token: userId, auth: token }, res => {
            res = res || {}
        })
    })
}

// 接收消息
SocketIOClient.prototype.receive = function (store) {
    const socket = this.socket

    socket.on('notification', ({ payload }) => {
        if (!payload) return
        // 前端传到storage 后监听某一个数据变化
       // store.dispatch('updateSocketData', payload)
    })
}

export default SocketIOClient


// 使用方式
// const socket = new SocketIO(process.env.REACT_APP_SOCKET_DOMAIN, userInfo.userId, accessToken)
// socket.openConnect()
// socket.receive(socketStore)
