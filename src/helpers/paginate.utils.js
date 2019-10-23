module.exports = (pageIndex, pageSize) => {
  const offset = pageIndex * pageSize
  const limit = parseInt(pageSize)
  return {
    offset,
    limit
  }
}
