import { injectable } from 'tsyringe';
import prisma from '../../prisma/client';
import { LogAction, Prisma } from '@prisma/client';

interface ChangedField {
  old: any;
  new: any;
}

interface LogParams {
  action: LogAction;
  objectType: string;
  objectId: number;
  actorUserId: number;
  changedFields?: Record<string, ChangedField>;
  transactionClient?: Prisma.TransactionClient;
}

@injectable()
export class AuditLogService {
  async log({
    action,
    objectType,
    objectId,
    actorUserId,
    changedFields = {},
    transactionClient,
  }: LogParams): Promise<void> {
    const db = transactionClient ?? prisma;

    const auditLog = await db.auditLog.create({
      data: {
        action,
        object_type: objectType,
        object_id: objectId,
        user_id: actorUserId,
        created_at: new Date(),
      },
    });

    if (
      (action === LogAction.CREATE || action === LogAction.UPDATE) &&
      Object.keys(changedFields).length > 0
    ) {
      const fieldLogs = Object.entries(changedFields).map(([field, values]) => ({
        audit_log_id: auditLog.id,
        field,
        old_value: values.old === null || values.old === undefined ? null : String(values.old),
        new_value: values.new === null || values.new === undefined ? null : String(values.new),
      }));

      await db.auditLogField.createMany({ data: fieldLogs });
    }
  }

  generateCreateFields(
    newData: Record<string, any>,
    onlyFields?: string[]
  ): Record<string, { old: any; new: any }> {
    const fieldsToCheck = onlyFields?.length ? onlyFields : Object.keys(newData);
    const changed: Record<string, { old: any; new: any }> = {};

    for (const key of fieldsToCheck) {
      changed[key] = {
        old: null,
        new: newData[key],
      };
    }

    return changed;
  }

  getChangedFields(
    oldData: Record<string, any>,
    newData: Record<string, any>,
    onlyFields: string[] = []
  ): Record<string, { old: any; new: any }> {
    const changed: Record<string, { old: any; new: any }> = {};

    const keysToCompare = onlyFields.length > 0 ? onlyFields : Object.keys(newData);

    for (const key of keysToCompare) {
      if (newData[key] !== oldData[key]) {
        changed[key] = {
          old: oldData[key],
          new: newData[key],
        };
      }
    }

    return changed;
  }
}