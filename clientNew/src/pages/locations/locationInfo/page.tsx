import useDocumentMetadata from '@hooks/useDocumentMetadata'
import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { UpdateLocation } from '../components/updateLocation'
import { Alert, App, Button, Skeleton } from 'antd'
import { MdKeyboardReturn } from 'react-icons/md'
import apiService from '@api/index'
import { useSelector } from 'react-redux'
import { TokenState } from '@features/reducers/token'
import { useSocket } from '@socket/provider/socketProvider'
import { AuthState } from '@features/reducers/auth'
import Marquee from 'react-fast-marquee'

const LocationInfoPage = () => {
  const { locationId } = useParams()
  const [locationName, setLocationName] = useState<string>('Loading...')
  useDocumentMetadata(`EX - Location: ${locationName}`, `Extreme Engineering - Location: ${locationName} Page`)
  const [loading, setLoading] = useState(true)
  const { message: messageApi } = App.useApp()
  const token = useSelector((state: TokenState) => state.token)
  const { socketProvider } = useSocket()
  const { user: currentUser } = useSelector((state: AuthState) => state.auth)

  // state
  const [location, setLocation] = useState<Location>()
  const [gotUpdated, setGotUpdated] = useState<boolean>(false)

  const handleUpdateStatus = () => {
    setGotUpdated(false)
  }

  useEffect(() => {
    if (locationId) {
      getLocation()
    }

    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [locationId])

  const getLocation = async () => {
    try {
      const { data } = await apiService.GET(`/address/${locationId}`, token)

      setLocationName(data?.city)

      setLocation(data)

      setLoading(false)
    } catch (error: any) {
      messageApi.open({
        type: 'error',
        content: error?.response?.data?.message
      })
    }
  }

  useEffect(() => {
    socketProvider.on('getWhoUpdatingLocation_to_client', async function ({
      userId,
      id,
      userName
    }) {
      if (currentUser?._id !== userId && locationId === id) {
        setGotUpdated(true)
        messageApi.open({
          type: 'warning',
          content: `${userName} updated this address now`
        })
      }
    })

    return () => {
      socketProvider.off("getWhoUpdatingLocation_to_client", getLocation)
    }
  }, [socketProvider])


  return (
    <Skeleton loading={loading} active paragraph={{ rows: 8 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Link to={'/locations'}>
          <Button
            style={{
              marginTop: '1em',
              color: 'green'
            }}
            icon={<MdKeyboardReturn />}
          >
            Back To Locations List
          </Button>
        </Link>
      </div>

      {gotUpdated &&
        <div
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex'
          }}
        >
          <Alert
            banner
            message={
              <Marquee pauseOnHover gradient={false}>
                <div onClick={handleUpdateStatus}>
                  Someone updated this address, please
                  <span><a target='_blank' href={`/locations/info/${locationId}`}> Click Here </a></span>
                  to check the new updates
                </div>
              </Marquee>
            }
          />
        </div>}

      {location &&
        <UpdateLocation
          location={location}
        />
      }
    </Skeleton>
  )
}

export default LocationInfoPage