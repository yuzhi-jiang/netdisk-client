export function getDiffTime(d1: Date, d2: Date) {
  const diffInMs = Math.abs(d2.getTime() - d1.getTime());
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${days}天, ${hours}小时, ${minutes}分钟`;
}

export default { getDiffTime };
