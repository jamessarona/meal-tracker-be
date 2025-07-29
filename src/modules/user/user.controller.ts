import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { UserService } from './user.service';

const userService = container.resolve(UserService);

export const getUsersPaginated = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const result = await userService.getUsersPaginated(page, limit);
  res.json(result);
};

export const getUserById = async (req: Request, res: Response) => {
  const user = await userService.getUserById(Number(req.params.id));
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

export const createUser = async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  res.status(201).json(user);
};

export const updateUser = async (req: Request, res: Response) => {
  const user = await userService.updateUser(Number(req.params.id), req.body);
  res.json(user);
};

export const deleteUser = async (req: Request, res: Response) => {
  await userService.deleteUser(Number(req.params.id));
  res.status(204).send();
};