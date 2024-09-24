export enum EPrismaErrorCodes {
  // find or findUniq ...
  NotFound = 'P2001',

  // during delete or update ...
  UnableToFindDuringAnOperation = 'P2025',

  // create or update ... repeated uniq field
  UniqueConstraintFailed = 'P2002',
}
