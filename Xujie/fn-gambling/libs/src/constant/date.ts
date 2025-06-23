import dayjs from '@commonUtils/localizedDayjs';

export const today = dayjs().startOf('day').unix().toString();
