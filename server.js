const app = require('./app');
const config = require('./app/config');
const MongoDB = require('./app/utils/mongodb.util');

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3001 });

let storedMessages = [];

wss.on('connection', (ws) => {
  console.log('A new client connected');

  // Gửi tin nhắn chào mừng khi có client kết nối
  ws.send(JSON.stringify({ message: "Welcome to WebSocket server!" }));

  // Lắng nghe tin nhắn từ client
  ws.on('message', (message) => {
    console.log('Received from client: ', message);
    try {
      const parsedMessage = JSON.parse(message);

      // Kiểm tra nếu tin nhắn là ping, thì bỏ qua nó
      if (parsedMessage.type === 'ping') {
        console.log('Received a ping message, ignoring...');
        return; // Loại bỏ việc xử lý ping
      }

      // Nếu tin nhắn không phải là ping, tiếp tục xử lý và gửi cho các client khác
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'newMessage', data: parsedMessage }));
        }
      });

    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  // Xử lý khi client đóng kết nối
  ws.on('close', () => {
    console.log('A client disconnected');
  });

  // Xử lý lỗi WebSocket
  ws.on('error', (error) => {
    console.error('WebSocket error: ', error);
  });
});

console.log('WebSocket server is running on ws://localhost:3001');

async function startServer() {
  try {
    await MongoDB.connect(config.db.uri);
    console.log('Connected to the database!');

    const PORT = config.app.port;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log('Cannot connect to the database!', error);
    process.exit();
  }
}

startServer();
