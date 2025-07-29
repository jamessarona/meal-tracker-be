export interface ITokenService<TPayload> {
  signToken(payload: TPayload): string;
  verifyToken(token: string): TPayload;
}