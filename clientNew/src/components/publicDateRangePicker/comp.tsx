import { DatePicker, Select, Space, Tooltip } from 'antd'
import dayjs from 'dayjs'

const { Option } = Select
const { RangePicker } = DatePicker

export type DateRange = {
  start: Date,
  end: Date,
}

export type PickerType = 'date' | 'week' | 'month' | 'year'

type PublicDatePickerProps = {
  setDateRange: (value: DateRange) => void
  dateRange: DateRange,
  type: PickerType,
  setType: (value: PickerType) => void,
}

const PublicDateRangePicker = ({ setDateRange, dateRange, type, setType }: PublicDatePickerProps) => {
  // const PickerWithType = ({
  //   type,
  // }: {
  //   type: PickerType;
  // }) => {
  //   return (
  //     <RangePicker
  //       picker={type}
  //       onChange={(value) => handleChangeDateRange(value, type)}
  //       value={[dayjs(dateRange.start), dayjs(dateRange.end)]}
  //     />
  //   )
  // }

  const handleChangeDateRange = (value: any, picker: string) => {
    if (!value) {
      if (picker === 'date') {
        setDateRange({
          start: dayjs().startOf('day').toDate(),
          end: dayjs().endOf('day').toDate(),
        })
      } else if (picker === 'week') {
        setDateRange({
          start: dayjs().startOf('week').toDate(),
          end: dayjs().endOf('week').toDate(),
        })
      } else if (picker === 'month') {
        setDateRange({
          start: dayjs().startOf('month').toDate(),
          end: dayjs().toDate(),
        })
      } else if (picker === 'year') {
        setDateRange({
          start: dayjs().startOf('year').toDate(),
          end: dayjs().endOf('year').toDate(),
        })
      }
      return
    }

    let start = dayjs(value[0])
    let end = dayjs(value[1])

    if (picker === 'date') {
      start = start.set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0)
      end = end.set('hour', 23).set('minute', 59).set('second', 59).set('millisecond', 999)
    } else if (picker === 'week') {
      start = start.startOf('week')
      end = end.endOf('week')
    } else if (picker === 'month') {
      start = start.startOf('month')
      end = end.endOf('month')
    } else if (picker === 'year') {
      start = start.startOf('year')
      end = end.endOf('year')
    }

    setDateRange({ start: start.toDate(), end: end?.toDate() })
  }

  return (
    <Tooltip title='Range Picker'>
      <Space>
        <Select value={type} onChange={setType}>
          <Option value="date">Date</Option>
          <Option value="week">Week</Option>
          <Option value="month">Month</Option>
          <Option value="year">Year</Option>
        </Select>
        <RangePicker
          picker={type}
          onChange={(value) => handleChangeDateRange(value, type)}
          value={[dayjs(dateRange.start), dayjs(dateRange.end)]}
        />
      </Space>
    </Tooltip>
  )
}

export default PublicDateRangePicker