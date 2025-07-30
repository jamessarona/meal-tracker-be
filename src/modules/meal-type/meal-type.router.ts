import { Router } from "express";
import * as mealTypeController from './meal-type.controller'
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get('/', mealTypeController.getMealTypesPaginated);
router.get('/:id', mealTypeController.getMealTypeById);
router.post('/', mealTypeController.createMealType);
router.put('/:id', mealTypeController.updateMealType);
router.delete('/:id', mealTypeController.deleteMealType);

export default router;