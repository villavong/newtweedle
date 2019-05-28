const express = require('express');
const connectDB = require('./config/db');
const app = express();
var cors = require('cors');
const path = require('path');

connectDB();
//init middleware
app.use(express.json({ extended: false }));
// what is it?
// app.get('/', (req, res) => res.send('API running'));
// //enable cors for dev
// app.use(cors());
// app.options('*', cors());

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept'
//   );
//   res.header(
//     'Access-Control-Allow-Methods',
//     'GET,PUT,POST,DELETE,PATCH,OPTIONS'
//   );
//   console.log('CORS');
//   next();
// });

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

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
//
