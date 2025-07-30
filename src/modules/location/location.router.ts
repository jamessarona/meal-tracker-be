import { Router } from "express";
import * as locationController from './location.controller'
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get('/', locationController.getLocationsPaginated);
router.get('/:id', locationController.getLocationById);
router.post('/', locationController.createLocation);
router.put('/:id', locationController.updateLocation);
router.delete('/:id', locationController.deleteLocation);

export default router;