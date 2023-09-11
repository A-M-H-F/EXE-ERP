import {
  dispatchGetActiveLocations,
  dispatchGetLocations,
  fetchActiveLocations,
  fetchLocations
} from '@features/actions/locations'
import { dispatchGetUsersSelection, fetchUsersSelection } from '@features/actions/usersSelection'
import { AuthState } from '@features/reducers/auth'
import { Location, LocationsListState } from '@features/reducers/locations'
import { TokenState } from '@features/reducers/token'
import { useSocket } from '@socket/provider/socketProvider'
import { hasPermission } from '@utils/roles/permissionUtils'
import { Space, Tooltip } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Table } from 'antd/lib'
import { useEffect, } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { ActiveLocationsListState } from '@features/reducers/locations/active'
import { LocationStatus } from '../status'
import { DeleteLocation } from '../delete'
import { Link } from 'react-router-dom'
import { EditOutlined } from '@ant-design/icons'
import { UsersSelectionListState } from '@features/reducers/usersSelection'

const LocationsList = () => {
  const token = useSelector((state: TokenState) => state.token)
  const { socketProvider } = useSocket()
  const dispatch = useDispatch()
  const locationsList = useSelector((state: LocationsListState) => state.locationsList)
  const activeLocationsList = useSelector((state: ActiveLocationsListState) => state.activeLocationsList)
  const usersSelection = useSelector((state: UsersSelectionListState) => state.usersSelection)
  const { user: currentUser, role } = useSelector((state: AuthState) => state.auth)
  const canUpdate = hasPermission(role, 'Locations', 'Update')
  const canDelete = hasPermission(role, 'Locations', 'Delete')

  const fetchLocationsEvent = async () => {
    fetchLocations(token).then((res: Location[]) => {
      dispatch(dispatchGetLocations(res))
    })

    fetchActiveLocations(token).then((res: Location[]) => {
      dispatch(dispatchGetActiveLocations(res))
    })
  }

  useEffect(() => {
    fetchLocationsEvent()

    fetchUsersSelection(token).then((res: any) => {
      dispatch(dispatchGetUsersSelection(res))
    })
  }, [])

  useEffect(() => {
    socketProvider.on('getLocations_to_client', async function ({
      userId
    }) {
      if (currentUser?._id !== userId) {
        await fetchLocationsEvent()
      }
    })

    return () => {
      socketProvider.off("getLocations_to_client", fetchLocationsEvent)
    }
  }, [socketProvider])

  // filters
  const filtersNames = locationsList?.map((location: Location) => (
    { text: location.city, value: location.city }
  ))
  const filterZones = locationsList
    .flatMap((location: Location) =>
      location.zones.map((zone) => ({
        text: zone.name,
        value: zone.name,
      }))
    )
    .reduce((uniqueZones: any, zone: any) => {
      const existingZone = uniqueZones.find((uniqueZone: any) => uniqueZone.value === zone.value);

      if (!existingZone) {
        uniqueZones.push(zone)
      }

      return uniqueZones
    }, [])
  const filterUsers = usersSelection?.map((user: any, index: number) => (
    {
      text: user?.name,
      value: user?.name,
      key: index
    }
  ))
  const filtersStatus = [
    {
      text: 'Active',
      value: 'active'
    },
    {
      text: 'In-Active',
      value: 'inactive'
    }
  ]

  const columns: ColumnsType<any> = [
    {
      title: 'City',
      key: 'city',
      dataIndex: 'city',
      render: (name) => <a>{name}</a>,
      fixed: 'left',
      filterSearch: true,
      onFilter: (value: any, record: any) => record?.city === value,
      filters: filtersNames,
      sorter: (a, b) => a.city.length - b.city.length,
    },
    {
      title: 'Total Zones',
      key: 'key',
      dataIndex: 'zones',
      render: (zones) => zones.length,
      filterSearch: true,
      filters: filterZones,
      onFilter: (value: any, record: Location) => {
        return record?.zones.some((zone) => zone.name === value);
      },
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (_, record) => (
        canUpdate ?
          <LocationStatus
            status={record?.status}
            id={record?._id}
            locationsList={locationsList}
            activeLocationsList={activeLocationsList}
          />
          : record?.status
      ),
      filterSearch: true,
      onFilter: (value: any, record: any) => record?.status === value,
      filters: filtersStatus,
    },
    {
      title: 'Entry By',
      key: 'createdBy',
      dataIndex: 'createdBy',
      filterSearch: true,
      onFilter: (value: any, record: any) => record?.createdBy?.name === value,
      filters: filterUsers,
      render: (user) => <a target='_blank' href={`/users/${user?._id}`}>{user?.name}</a>
    },
    {
      title: 'Entry Date',
      key: 'createdAt',
      dataIndex: 'createdAt',
      render: (date: Date) => new Date(date)?.toLocaleDateString('en-GB'),
      sorter: (a: any, b: any) => {
        const dateA = new Date(a.createdAt as string).getTime();
        const dateB = new Date(b.createdAt as string).getTime();
        return dateA - dateB;
      }
    },
    {
      title: 'Updated By',
      key: 'updatedBy',
      dataIndex: 'updatedBy',
      filterSearch: true,
      onFilter: (value: any, record: any) => record?.updatedBy?.name === value,
      filters: filterUsers,
      render: (user) => (
        user?.name ? <a target='_blank' href={`/users/${user?._id}`}>{user?.name}</a>
          : '------'
      )
    },
    {
      title: 'Update Date',
      key: 'updatedAt',
      dataIndex: 'updatedAt',
      render: (date: Date) => new Date(date)?.toLocaleDateString('en-GB'),
      sorter: (a: any, b: any) => {
        const dateA = new Date(a.updatedAt as string).getTime();
        const dateB = new Date(b.updatedAt as string).getTime();
        return dateA - dateB;
      },
    }
  ]

  const updatedColumns = [...columns]

  if (canUpdate) {
    updatedColumns.push(
      {
        title: 'Action',
        key: 'action',
        dataIndex: '_id',
        render: (_: any, location: Location) => (
          <Space>
            <Link to={`/locations/info/${location._id}`}>
              <Tooltip title={'Update Address'}>
                <EditOutlined />
              </Tooltip>
            </Link>

            {canDelete &&
              <DeleteLocation
                id={location?._id}
                locationsList={locationsList}
                activeLocationsList={activeLocationsList}
              />
            }
          </Space>
        ),
      }
    )
  }

  const pageSize = () => {
    const totalSize = locationsList?.length
    const options = []

    for (let start = 10; start <= totalSize;) {
      options.push(start);
      if (start >= 50) {
        start += 50;
      } else if (start >= 30) {
        start += 20;
      } else {
        start += 10;
      }
    }

    return options
  }

  return (
    <>
      <Table
        columns={updatedColumns}
        dataSource={locationsList}
        rowKey={'_id'}
        bordered
        scroll={{ x: 1400, }}
        pagination={{
          showTotal: (total) => <div style={{ color: 'blue' }}>Total: {total}</div>,
          pageSizeOptions: locationsList?.length >= 10 ? [...pageSize(), locationsList?.length] : [...pageSize()],
          showSizeChanger: true
        }}
        title={() => (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <div>
              Locations
            </div>

            <div>
              Total: {locationsList?.length}
            </div>
          </div>
        )}
      />
    </>
  )
}

export default LocationsList