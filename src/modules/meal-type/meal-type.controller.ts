import { container } from "tsyringe";
import { MealTypeService } from "./meal-type.service";
import { StatusCodes } from "http-status-codes";
import { Response } from "express";
import { AuthenticatedRequest } from "../../types/authenticated-request";

const mealTypeService = container.resolve(MealTypeService);

export const getMealTypesPaginated = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = (req.query.search as string) || '';

        const result = await mealTypeService.getMealTypesPaginated(page, limit, search);
        res.json(result);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
            message: 'Error fetching meal types', 
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

export const getMealTypeById = async (req: AuthenticatedRequest, res: Response) => {
    const mealType = await mealTypeService.getMealTypeById(Number(req.params.id));
    if (!mealType) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Meal type not found' });
    res.status(StatusCodes.OK).json(mealType);
};

export const createMealType = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) 
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized: user not found in request' });
    if (!req.body.name) 
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Name is required' });

    const mealType = await mealTypeService.createMealType(req.body, req.user.id);
    res.status(StatusCodes.CREATED).json({
        message: "Meal type created successfully",
        id: mealType.id
    });
};

export const updateMealType = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) 
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized: user not found in request' });

    const mealType = await mealTypeService.updateMealType(Number(req.params.id), req.body, req.user.id);
    res.json(mealType);
};

export const deleteMealType = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) 
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized: user not found in request' });

    await mealTypeService.deleteMealType(Number(req.params.id), req.user.id);
    res.status(StatusCodes.NO_CONTENT).send();
}