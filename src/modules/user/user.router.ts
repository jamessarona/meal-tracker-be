import { authenticate } from '../../middleware/auth.middleware';
import { Router } from 'express'
import * as userController from './user.controller'
const router = Router()

router.use(authenticate);

router.get('/', userController.getUsersPaginated)
router.get('/:id', userController.getUserById)
router.post('/', userController.createUser)
router.put('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)

export default router