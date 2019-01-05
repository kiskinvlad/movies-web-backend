import 'dotenv/config';
import { logger } from "./config";
import app from './App';
/**
 * Server port and custom variable
 */
const port = process.env.PORT || 3000; 
const name = process.env.NAME
/**
 * Entry endpoint of express app
 * Starting server
 */
app.listen(port, (err) => { 
  if (err) { 
    return logger.error(err) 
  } 
  return logger.info(`Hello ${name}, server is listening on port ${port}`);
})