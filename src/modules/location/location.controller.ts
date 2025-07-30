import { container } from "tsyringe";
import { StatusCodes } from "http-status-codes";
import { Response } from "express";
import { AuthenticatedRequest } from "../../types/authenticated-request";
import { LocationService } from "./location.service";

const locationService = container.resolve(LocationService);

export const getLocationsPaginated = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = (req.query.search as string) || '';

        const result = await locationService.getLocationsPaginated(page, limit, search);
        res.json(result);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
            message: 'Error fetching locations', 
            error: error instanceof Error ? error.message : String(error)
        });
    }
}

export const getLocationById = async (req: AuthenticatedRequest, res: Response) => {
    const location = await locationService.getLocationById(Number(req.params.id));
    if (!location) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Location not found' });
    res.status(StatusCodes.OK).json(location);
};

export const createLocation = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) 
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized: user not found in request' });
    if (!req.body.name) 
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Name is required' });

    const location = await locationService.createLocation(req.body, req.user.id);
    res.status(StatusCodes.CREATED).json({
        message: "Location created successfully",
        id: location.id
    });
};

export const updateLocation = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) 
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized: user not found in request' });

    const location = await locationService.updateLocation(Number(req.params.id), req.body, req.user.id);
    res.json(location);
};

export const deleteLocation = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) 
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized: user not found in request' });

    await locationService.deleteLocation(Number(req.params.id), req.user.id);
    res.status(StatusCodes.NO_CONTENT).send();
}