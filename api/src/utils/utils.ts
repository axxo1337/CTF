export const start_epoch = 1695947401000;

export const max_chall_score = 500;
export const min_chall_score = 50;
export const max_base_score = 50;

export const user_status_flags = {
  NONE: 0,
  ADMIN: 1,
  BANNED: 2,
};

export function IsCTFStarted() {
  return !(Date.now() < start_epoch);
}

export function IsCTFOver() {
  return !(Date.now() > start_epoch);
}