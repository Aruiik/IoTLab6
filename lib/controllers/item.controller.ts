import Controller from '../interfaces/controller.interface';
import { Request, Response, Router } from 'express';

const itemsStorage: Item[] = [];
let idCounter = 1;

interface Item {
    id: number;
    name: string;
}

class ItemController implements Controller {
    public path = '/items';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(this.path, this.createItem);
        this.router.get(this.path, this.getItems);
        this.router.get(`${this.path}/:id`, this.getItemById);
        this.router.put(`${this.path}/:id`, this.updateItem);
        this.router.delete(`${this.path}/:id`, this.deleteItem);
    }

    private createItem = async (request: Request, response: Response) => {
        const newItem: Item = { id: idCounter++, ...request.body };
        itemsStorage.push(newItem);
        response.status(201).json(newItem);
    }

    private getItems = async (request: Request, response: Response) => {
        console.log("Current items:", itemsStorage);
        response.json(itemsStorage);
    }

    private getItemById = async (request: Request, response: Response) => {
        const item = itemsStorage.find(i => i.id === +request.params.id);
        if (item) {
            response.json(item);
        }
        else {
            response.status(404).json({ error: 'Item not found' });
        }
    }

    private updateItem = async (request: Request, response: Response) => {
        const index = itemsStorage.findIndex(i => i.id === +request.params.id);
        if (index === -1) {
            return response.status(404).json({ error: 'Item not found' });
        }
        itemsStorage[index] = { id: +request.params.id, ...request.body };
        response.json(itemsStorage[index]);
    }

    private deleteItem = async (request: Request, response: Response) => {
        const index = itemsStorage.findIndex(i => i.id === +request.params.id);
        if (index !== -1) {
            (itemsStorage.splice(index, 1), response.status(204).send())
        }
        else {
            response.status(404).json({ error: 'Item not found' });
        }
    }
}

export default ItemController;
