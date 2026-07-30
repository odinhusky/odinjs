// utils/date/zonedDate.ts
import { DateTime, FixedOffsetZone } from "luxon";

export interface ZonedDateOptions {
  sourceOffsetMin: number;
  outputOffsetMin?: number;
  transform?: (dt: DateTime) => DateTime;
}

export function zonedDate(
  dateStr: string,
  options: ZonedDateOptions
): DateTime {
  const {
    sourceOffsetMin,
    outputOffsetMin = 0,
    transform,
  } = options;

  let dt = DateTime.fromISO(dateStr, {
    zone: FixedOffsetZone.instance(sourceOffsetMin),
  });

  if (transform) {
    dt = transform(dt);
  }

  return dt.setZone(
    FixedOffsetZone.instance(outputOffsetMin)
  );
}

