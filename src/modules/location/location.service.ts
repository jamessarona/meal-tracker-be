import { inject, injectable } from "tsyringe";
import { LocationRepository } from "./location.repository";
import { AuditLogService } from "../audit-log/audit-log.service";
import { LocationResponseDTO, LocationResponsePaginatedDTO } from "./location.dto";
import prisma from "../../prisma/client";
import { LogAction } from "@prisma/client";
import { HttpError } from "../../utils/httpError";
import { StatusCodes } from "http-status-codes";

@injectable()
export class LocationService {
    constructor(
        @inject('LocationRepository') private locationRepo: LocationRepository,
        @inject('AuditLogService') private auditLogService: AuditLogService,
    ) {}

    private static readonly loggableFields = ['name', 'is_active'];

    async getLocationsPaginated(page: number, limit: number, search?: string): Promise<LocationResponsePaginatedDTO | null> {
        const skip = (page - 1) * limit;

        const [locations, total] = await Promise.all([
            this.locationRepo.findPaginated(skip, limit, search),
            this.locationRepo.countAll(search),
        ]);

        return {
            data: locations,
            page,
            totalPages: Math.ceil(total / limit),
            totalRecords: total,
        };
    }

    async getLocationById(id: number): Promise<LocationResponseDTO | null> {
        const location = await this.locationRepo.findById(id);
        return location ? location : null;
    }

    async createLocation(data: { name: string }, currentUserId: number): Promise<LocationResponseDTO> {
        const result = await prisma.$transaction(async (transactionClient) => {
            const transLocationRepo = new LocationRepository(transactionClient);

            const location = await transLocationRepo.create({
                ...data,
                is_active: true,
            });

            const changedFields = this.auditLogService.generateCreateFields(
                location,
                LocationService.loggableFields
            );

            await this.auditLogService.log({
                action: LogAction.CREATE,
                objectType: 'Location',
                objectId: location.id,
                actorUserId: currentUserId,
                changedFields,
                transactionClient,
            });

            return location;
        });

        return result;
    }

    async updateLocation(id: number, data: Partial<{ name: string; is_active: boolean }>, currentUserId: number): Promise<LocationResponseDTO> {
        const oldLocation = await this.locationRepo.findById(id);
        if (!oldLocation)
            throw new HttpError(`Location with id ${id} not found.`, StatusCodes.NOT_FOUND);

        const result = await prisma.$transaction(async (transactionClient) => {
        const transLocationRepo = new LocationRepository(transactionClient);

        const updatedLocation = await transLocationRepo.update(id, data);

        const changedFields = this.auditLogService.getChangedFields(
            oldLocation,
            updatedLocation,
            LocationService.loggableFields
        );

        await this.auditLogService.log({
            action: LogAction.UPDATE,
            objectType: 'Location',
            objectId: id,
            actorUserId: currentUserId,
            changedFields,
            transactionClient
        });

        return updatedLocation;
        });

        return result;
    }

    async deleteLocation(id: number, currentUserId: number): Promise<void> {
        const oldLocation = await this.locationRepo.findById(id);
        if (!oldLocation)
            throw new HttpError(`Location with id ${id} not found.`, StatusCodes.NOT_FOUND);

        await prisma.$transaction(async (transactionClient) => {
            const transLocationRepo = new LocationRepository(transactionClient);

            await transLocationRepo.delete(id);

            await this.auditLogService.log({
                action: LogAction.DELETE,
                objectType: 'Location',
                objectId: id,
                actorUserId: currentUserId,
                changedFields: this.auditLogService.generateCreateFields(oldLocation, LocationService.loggableFields),
                transactionClient,
            });
        });
    }
}