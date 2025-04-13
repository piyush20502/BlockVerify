// At the VERY TOP of your entry file (server.js)
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
// After mongoose connection
require('./models/User');
require('./models/VerificationLog');

// Connect to Database
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
}); 