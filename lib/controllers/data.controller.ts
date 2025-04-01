import Controller from '../interfaces/controller.interface';
import { Request, Response, NextFunction, Router } from 'express';
import DataService from '../modules/services/data.service';
import { IData } from 'modules/models/data.model';

class DataController implements Controller {
    public path = '/api/data';
    public router = Router();
    private dataService = new DataService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/get', this.getAll);
        this.router.post(`/post`, this.postItems);
        this.router.delete(`/delete/:id`, this.deleteItem);
    }

    private getAll = async (request: Request, response: Response) => {
        try {
            const data = await this.dataService.getAll();
            response.send(data);
        } catch (error) {
            response.status(500).send(`Error fetching data: ${error.message}`);
        }
    }

    private postItems = async (request: Request, response: Response) => {
        try {
            const data: IData = request.body;
            const newData = await this.dataService.post(data);
            response.status(201).send(newData);
        } catch (error) {
            response.status(500).send(`Error saving data: ${error.message}`);
        }
    };

    private deleteItem = async (request: Request, response: Response) => {
        try {
            const { id } = request.params;
            const deletedData = await this.dataService.delete(id);
            if (!deletedData) {
                response.status(404).send(`Data with ID ${id} not found`);
                return;
            }
            response.status(200).send(`Deleted data: ${JSON.stringify(deletedData)}`);
        } catch (error) {
            response.status(500).send(`Error deleting data: ${error.message}`);
        }
    }
}

export default DataController;
