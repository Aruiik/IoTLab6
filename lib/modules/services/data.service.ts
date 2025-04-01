import { IData } from 'modules/models/data.model';
import DataModel from '../schemas/data.schema';

export default class DataService {

   public async getAll() {
       try {
           const data = await DataModel.find();
           return data;
       } catch (error) {
           throw new Error(`Query failed: ${error}`);
       }
   }

   public async post(data: IData) {
       try {
           const newData = new DataModel(data);
           await newData.save();
           return newData;
       } catch (error) {
           throw new Error(`Post failed: ${error}`);
       }
   }

   public async delete(id: string) {
       try {
           const deletedData = await DataModel.findByIdAndDelete(id);
           if (!deletedData) {
               throw new Error('Item not found');
           }
           return deletedData;
       } catch (error) {
           throw new Error(`Delete failed: ${error}`);
       }
   }
}
