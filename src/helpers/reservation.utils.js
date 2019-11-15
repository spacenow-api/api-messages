const moment = require('moment')

const getEndDate = (dateStart, period, bookingType) => {
  let end
  switch (bookingType) {
    case 'daily':
      end = moment(dateStart).add(period, 'days')
      break
    case 'weekly':
      end = moment(dateStart).add(period, 'weeks')
      break
    case 'monthly':
      end = moment(dateStart).add(period, 'months')
      break
  }
  return end
}

const getDates = (dateStart, dateEnd) => {
  const dates = []
  let start = moment(dateStart)
  let end = moment(dateEnd)
  while (start < end) {
    dates.push(start.toISOString())
    start = start.clone().add(1, 'd')
  }
  return dates
}

const onSortDates = (dates) => {
  return dates.sort((a, b) => {
    const dateA = new Date(a)
    const dateB = new Date(b)
    return dateA.getTime() - dateB.getTime()
  })
}

module.exports = { getEndDate, getDates, onSortDates }
