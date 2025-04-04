import express from 'express';
import { config } from './config';
import Controller from "./interfaces/controller.interface";
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

class App {
   public app: express.Application;

   constructor(controllers: Controller[]) {
       this.app = express();
       this.initializeMiddlewares();
       this.initializeControllers(controllers);
       this.connectToDatabase();
   }

   private initializeControllers(controllers: Controller[]): void {
    controllers.forEach((controller) => {
        this.app.use(controller.path, controller.router);
    });
}

public listen(): void {
    this.app.listen(config.port, () => {
        console.log(`App listening on the port ${config.port}`);
    });
}

private initializeMiddlewares(): void {
    this.app.use(bodyParser.json());
   }

   private async connectToDatabase(): Promise<void> {
    mongoose.set('debug', true);
     try {
       await mongoose.connect(config.databaseUrl);
       console.log('Connection with database established at port');
       console.log(config.databaseUrl)
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
   
    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });
   
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
   
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });
   
    process.on('SIGTERM', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });
   }
   
       
   
}
export default App;
