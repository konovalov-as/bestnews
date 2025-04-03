const getUniqueId = function (): string {
  return Math.random() + '.' + Date.now()
};

export {
  getUniqueId,
}