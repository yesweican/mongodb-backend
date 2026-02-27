const getPaginationParams = (req) => {
  const page = Math.max(parseInt(req.query.page) || 0, 0);
  const pageSize = Math.min(Math.max(parseInt(req.query.pageSize) || 20, 1), 100);

  return {
    page,
    pageSize,
    skip: page * pageSize
  };
};

export default getPaginationParams;