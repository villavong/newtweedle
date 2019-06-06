const express = require('express');
const connectDB = require('./config/db');
const app = express();
var cors = require('cors');
const path = require('path');
const socket = require('socket.io');
const Message = require('./models/Messages.js');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

connectDB();
//init middleware
app.use(express.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());

// what is it?

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   res.header('Access-Control-Allow-Methods', 'GET, POST');
//   next();
// });

// app.get('/', (req, res) => res.send('API running'));
//enable cors for dev
app.use(cors());
app.options('*', cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'GET,PUT,POST,DELETE,PATCH,OPTIONS'
  );
  console.log('CORS');
  next();
});

//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

//Socket

// Start the server at the specified PORT

let server = app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}`)
);

// Starting a socket on the specified server
let io = socket(server);

io.on('connection', socket => {
  socket.on('new-message', data => {
    io.sockets.emit('new-message', data);
  });
});

// GET all the previous messages
app.get('/api/message', (req, res) => {
  Message.find({}).exec((err, messages) => {
    if (err) {
      res.send(err).status(500);
    } else {
      res.send(messages).status(200);
    }
  });
});

// POST a new message
app.post('/api/message', (req, res) => {
  Message.create(req.body)
    .then(message => {
      res.send(message).status(200);
    })
    .catch(err => {
      console.log(err);
      res.send(err).status(500);
    });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('./client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/build/index.html'));
  });
}

//file upload

// Upload Endpoint
app.post('/upload', (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  const file = req.files.file;

  file.mv(`${__dirname}/client/public/uploads/${file.name}`, err => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  });
});
