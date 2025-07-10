import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { syncDB } from './models/index.js';

const PORT = process.env.PORT || 5001;

syncDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on PORT:${PORT}`);
  });
});
