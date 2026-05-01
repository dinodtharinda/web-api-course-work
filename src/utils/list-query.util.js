const parseListQuery = (query, options = {}) => {
  const {
    defaultSortBy = 'createdAt',
    defaultSortOrder = 'DESC',
    allowedSortBy = [defaultSortBy],
    maxPageSize = 100,
  } = options;

  const page = Math.max(Number.parseInt(query.page || 1, 10) || 1, 1);
  const pageSize = Math.min(Math.max(Number.parseInt(query.pageSize || 20, 10) || 20, 1), maxPageSize);
  const requestedSortBy = String(query.sortBy || defaultSortBy).trim();
  const requestedSortOrder = String(query.sortOrder || defaultSortOrder).trim().toUpperCase();
  const sortBy = allowedSortBy.includes(requestedSortBy) ? requestedSortBy : defaultSortBy;
  const sortOrder = requestedSortOrder === 'ASC' ? 'ASC' : 'DESC';
  const search = String(query.search || '').trim();

  return {
    page,
    pageSize,
    limit: pageSize,
    offset: (page - 1) * pageSize,
    sortBy,
    sortOrder,
    search,
  };
};

module.exports = {
  parseListQuery,
};