import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { UserService } from './user.service';
import { AuthenticatedRequest } from 'src/types/authenticated-request';
import { StatusCodes } from 'http-status-codes';

const userService = container.resolve(UserService);

export const getUsersPaginated = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || ''; 
    
    const result = await userService.getUsersPaginated(page, limit, search);
    res.json(result);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      message: 'Error fetching users', 
      error: error instanceof Error ? error.message : String(error)
  });
  }   
};

export const getUserById = async (req: Request, res: Response) => {
  const user = await userService.getUserById(Number(req.params.id));
  if (!user) return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
  res.status(StatusCodes.OK).json(user);
};

export const createUser = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) 
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized: user not found in request' });
  
  const user = await userService.createUser(req.body, req.user.id);
  res.status(StatusCodes.CREATED).json({
    message: "User created successfully",
    id: user.id
  });
};

export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) 
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized: user not found in request' });

  const user = await userService.updateUser(Number(req.params.id), req.body, req.user.id);
  res.json(user);
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) 
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized: user not found in request' });

  await userService.deleteUser(Number(req.params.id), req.user.id);
  res.status(StatusCodes.NO_CONTENT).send();
};