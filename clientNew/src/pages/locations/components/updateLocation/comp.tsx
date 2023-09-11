import { CloseOutlined, EyeInvisibleOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons'
import apiService from '@api/index'
import { dispatchGetActiveLocations, dispatchGetLocations } from '@features/actions/locations'
import { AuthState } from '@features/reducers/auth'
import { Location, LocationZone, LocationsListState } from '@features/reducers/locations'
import { ActiveLocationsListState } from '@features/reducers/locations/active'
import { TokenState } from '@features/reducers/token'
import { useWindowDimensions } from '@hooks/useWindowDimensions'
import { useSocket } from '@socket/provider/socketProvider'
import { checkLength, checkWhiteSpaces } from '@utils/stringCheck'
import { App, Button, Card, Col, Form, Input, Menu, MenuProps, Row, Space, Spin, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { FiMap } from 'react-icons/fi'
import { GiHorizonRoad, GiModernCity } from 'react-icons/gi'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

type UpdateLocationProps = {
    location: Location | any
}

type Street = {
    key: number;
    name: string
}
type Zone = {
    key: number;
    name: string;
    streets: Street[]
}
type InitialState = {
    city: string,
    zones: Zone[]
}

const UpdateLocation = ({ location }: UpdateLocationProps) => {
    const { screenSizes } = useWindowDimensions()
    const { xs, sm, md } = screenSizes

    const { message: messageApi } = App.useApp()
    const token = useSelector((state: TokenState) => state.token)
    const { user: currentUser } = useSelector((state: AuthState) => state.auth)
    const { socketProvider } = useSocket()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const locationsList = useSelector((state: LocationsListState) => state.locationsList)
    const activeLocationsList = useSelector((state: ActiveLocationsListState) => state.activeLocationsList)

    // state
    const [updating, setUpdating] = useState<boolean>(false)

    const initialState: InitialState = {
        city: location.city,
        zones: location.zones.map((zone: LocationZone, index: number) => {
            const newStreets = zone.streets.map((street, i: number) => (
                { name: street.name, key: i }
            ))
            return { name: zone.name, key: index, streets: newStreets }
        })
    }

    const [address, setAddress] = useState<InitialState>(initialState)

    useEffect(() => {
        const newZones = location.zones.map((zone: LocationZone, index: number) => {
            const newStreets = zone.streets.map((street, i: number) => (
                { name: street.name, key: i }
            ))
            return { name: zone.name, key: index, streets: newStreets }
        })

        const data: InitialState = {
            city: location.city,
            zones: newZones
        }

        setAddress(data)
    }, [])

    const { city, zones } = address

    // handle values
    const handleValues = (value: string) => {
        const words = value.split(' ');
        const capitalizedValue = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

        return capitalizedValue
    }

    // city name
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        const capitalizedValue = handleValues(value)

        setAddress({ ...address, [name]: String(capitalizedValue) });
    }

    const [selectedZone, setSelectedZone] = useState<Zone>(zones[0])

    // zones
    const handleAddZone = () => {
        const newZone = {
            key: zones.length,
            name: `New Zone`,
            streets: [
                {
                    name: 'New Street',
                    key: 0
                }
            ]
        }
        setAddress({
            ...address,
            zones: [
                ...zones,
                {
                    ...newZone
                }
            ]
        })

        setSelectedZone(newZone)
    }

    const handleRemoveZone = (zoneKey: number) => {
        const selected = selectedZone
        const removed = zones.filter((zone: Zone) => zone.key !== zoneKey)

        const updatedList = removed.map((zone: Zone, index: number) => (
            { ...zone, key: index }
        ))

        const findSelected: Zone | any = updatedList.find((zone: Zone) => zone.name === selected.name)

        if (selected.key === zoneKey) {
            setSelectedZone(updatedList[0])
        } else {
            setSelectedZone(findSelected)
        }

        setAddress({ ...address, zones: updatedList })
    }

    const handleChangeZoneName = (e: React.ChangeEvent<HTMLInputElement>, zoneKey: number) => {
        const { value } = e.target

        const capitalizedValue = handleValues(value)

        const updatedList = zones.map((zone: Zone) => {
            if (zone.key === zoneKey) {
                return { ...zone, name: capitalizedValue }
            }

            return zone
        })

        setAddress({ ...address, zones: updatedList })
    }

    // streets
    const handleAddStreet = (zoneKey: number) => {
        const updatedList = zones.map((zone: Zone) => {
            if (zone.key === zoneKey) {
                return {
                    ...zone,
                    streets: [
                        ...zone.streets,
                        {
                            key: zone.streets.length,
                            name: `New Street`
                        }
                    ]
                }
            }

            return zone
        })

        setAddress({ ...address, zones: updatedList })
    }

    const handleRemoveStreet = (zoneKey: number, streetKey: number) => {
        const updatedList = zones.map((zone: Zone) => {
            if (zone.key === zoneKey) {
                const removed = zone.streets.filter((street: Street) => street.key !== streetKey)

                const updatedStreets = removed.map((street: Street, index: number) => (
                    { ...street, key: index }
                ))

                return { ...zone, streets: updatedStreets }
            }
            return zone
        })

        setAddress({ ...address, zones: updatedList })
    }

    const handleUpdateStreetName = (e: React.ChangeEvent<HTMLInputElement>, zoneKey: number, streetKey: number) => {
        const { value } = e.target

        const capitalizedValue = handleValues(value)

        const updatedList = zones.map((zone: Zone) => {
            if (zone.key === zoneKey) {
                const updatedStreets = zone.streets.map((street: Street) => {
                    if (street.key === streetKey) {
                        return { ...street, name: capitalizedValue }
                    }

                    return street
                })

                return { ...zone, streets: updatedStreets }
            }
            return zone
        })

        setAddress({ ...address, zones: updatedList })
    }

    const items: MenuProps['items'] = zones.map((zone: Zone) => (
        {
            key: String(zone.key),
            label: (
                <Space>
                    <Input
                        value={zone.name}
                        onChange={(e: any) => handleChangeZoneName(e, zone.key)}
                    />

                    <Button icon={selectedZone.key === zone.key ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        onClick={() => setSelectedZone(zone)}
                    />

                    {zones?.length > 1 &&
                        <Button icon={<CloseOutlined />}
                            onClick={() => handleRemoveZone(zone.key)}
                            danger
                        />
                    }
                </Space>
            ),
            // onClick: () => handleSetSelectedZone(zone),
            style: {
                borderLeft: selectedZone?.key === zone.key ? 'solid' : '',
                minWidth: '100%'
            },
            icon: <FiMap />,
        }
    ))

    const handleSaveLocation = async () => {
        // city name
        const cityWhiteSpaceCheck = checkWhiteSpaces(city)
        const cityLength = checkLength(city, 2)
        if (cityWhiteSpaceCheck) {
            messageApi.open({
                type: 'error',
                content: `Please add a city name`,
                duration: 2
            })
            return
        }
        if (cityLength) {
            messageApi.open({
                type: 'error',
                content: `City name length should be at least 3 letters`,
                duration: 2
            })
            return
        }

        // zones
        if (zones.length <= 0) {
            messageApi.open({
                type: 'error',
                content: 'Please add at lease 1 zone',
                duration: 2
            })
            return
        }

        const zonesNameString = zones.some((zone: Zone) => checkWhiteSpaces(zone.name))
        const zonesNameLength = zones.some((zone: Zone) => checkLength(zone.name, 2))
        if (zonesNameString) {
            messageApi.open({
                type: 'error',
                content: 'Please check zones names, some contain whitespace only',
                duration: 2
            })
            return
        }
        if (zonesNameLength) {
            messageApi.open({
                type: 'error',
                content: 'Zone name length should be at least 3 letters',
                duration: 2
            })
            return
        }

        // streets
        const streetsLength = zones.some((zone: Zone) => zone.streets.length <= 0)
        const streetsNameString = zones.some((zone: Zone) => {
            return zone.streets.some((street: Street) => checkWhiteSpaces(street.name))
        })
        const streetsNameLength = zones.some((zone: Zone) => {
            return zone.streets.some((street: Street) => checkLength(street.name, 2))
        })

        if (streetsLength) {
            messageApi.open({
                type: 'error',
                content: 'Please add at least 1 street to each zone',
                duration: 2
            })
            return
        }
        if (streetsNameString) {
            messageApi.open({
                type: 'error',
                content: 'Please check streets names, some contain whitespace only',
                duration: 2
            })
            return
        }
        if (streetsNameLength) {
            messageApi.open({
                type: 'error',
                content: 'Streets name length should be at least 3 letters',
                duration: 2
            })
            return
        }

        const body = {
            city,
            zones
        }

        try {
            setUpdating(true)

            const { data } = await apiService.PUT(`/address/${location?._id}`, body, token)
            const { message, updated } = data

            messageApi.open({
                type: 'success',
                content: message
            })

            // update state
            const updatedLocationsList = locationsList.map((address: Location) => {
                if (address._id === location._id) {
                    return { ...updated }
                }
                return address
            })
            dispatch(dispatchGetLocations(updatedLocationsList))
            const updatedActiveLocationsList = activeLocationsList.map((address: Location) => {
                if (address._id === location._id) {
                    return { ...updated }
                }
                return address
            })
            dispatch(dispatchGetActiveLocations(updatedActiveLocationsList))

            // socket event
            socketProvider.emit('getLocations_to_server', { userId: currentUser?._id });

            socketProvider.emit('getWhoUpdatingLocation_to_server', {
                userId: currentUser?._id, userName: currentUser?.name, id: location?._id
            })

            setUpdating(false)
            setAddress(initialState)
            navigate('/locations')
        } catch (error: any) {
            setUpdating(false)
            messageApi.open({
                type: 'error',
                content: await error?.response?.data?.message
            })
        }
    }

    return (
        <Spin spinning={updating}>
            <Card
                title={
                    <div>
                        <Form layout='vertical'
                            style={{
                                marginTop: '0.5em'
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Form.Item
                                    label='City Name'
                                    required
                                >
                                    <Input
                                        value={city}
                                        onChange={handleNameChange}
                                        name='city'
                                        placeholder='city name'
                                        prefix={<GiModernCity />}
                                    />
                                </Form.Item>

                                <Button
                                    type='primary'
                                    onClick={handleSaveLocation}
                                    loading={updating}
                                >
                                    Update City
                                </Button>
                            </div>
                        </Form>
                    </div>
                }

                style={{
                    marginTop: '2em',
                    width: '100%'
                }}
            >
                <div
                    style={{
                        display: xs || sm || md ? 'block' : 'flex'
                    }}
                >
                    <Card
                        title={
                            <>
                                <Typography
                                    style={{
                                        textAlign: 'center',
                                        fontSize: '18px',
                                        marginBottom: '0.5em',
                                    }}
                                >
                                    Zones
                                </Typography>
                                <Button
                                    icon={<PlusOutlined />}
                                    onClick={handleAddZone}
                                    style={{
                                        marginBottom: '0.5em',
                                    }}
                                >
                                    Add zone
                                </Button>
                            </>
                        }

                        hoverable
                        style={{
                            minHeight: '650px',
                            maxHeight: '650px',
                            minWidth: xs || sm || md ? '100%' : '20%',
                            marginBottom: xs || sm || md ? '2em' : '',
                        }}
                    >
                        <div
                            style={{
                                minHeight: '500px',
                                maxHeight: '500px',
                                overflowY: 'auto',
                                overflowX: 'hidden',
                            }}
                        >
                            <Menu
                                mode="vertical"
                                style={{
                                    border: 'none'
                                }}
                                items={items}
                                defaultSelectedKeys={['0']}
                                selectedKeys={[String(selectedZone.key)]}
                            />
                        </div>
                    </Card>

                    <Card
                        title={(
                            <>
                                <Typography
                                    style={{
                                        textAlign: 'center',
                                        fontSize: '18px',
                                    }}
                                >
                                    Streets
                                </Typography>

                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginTop: '0.5em',
                                        marginBottom: '0.5em',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Typography>
                                        Zone: {selectedZone.name} {selectedZone.key + 1}
                                    </Typography>
                                    <Button
                                        icon={<PlusOutlined />}
                                        onClick={() => handleAddStreet(selectedZone.key)}
                                        style={{
                                            marginLeft: '0.5em'
                                        }}
                                    >
                                        Add street
                                    </Button>
                                </div>
                            </>
                        )}

                        hoverable
                        style={{
                            minHeight: '650px',
                            marginLeft: xs || sm || md ? '' : '2em',
                            width: '-webkit-fill-available'
                        }}
                    >
                        <div
                            style={{
                                minHeight: '500px',
                                maxHeight: '500px',
                                minWidth: xs || sm || md ? '100%' : '600px',
                                maxWidth: xs || sm || md ? '100%' : '100%',
                                overflowY: 'auto',
                                overflowX: 'hidden',
                            }}
                        >
                            <Row
                                gutter={[24, 24]}
                            >
                                {zones.map((zone: Zone) => {
                                    if (zone?.key === selectedZone.key) {
                                        return (
                                            zone.streets.map((street: Street) => (
                                                <Col key={street.key}
                                                    offset={1}
                                                >
                                                    <Space>
                                                        <Input
                                                            value={street.name}
                                                            onChange={(e: any) => handleUpdateStreetName(e, zone.key, street.key)}
                                                            prefix={<GiHorizonRoad />}
                                                        />

                                                        {zone.streets.length > 1 &&
                                                            <Button
                                                                onClick={() => handleRemoveStreet(zone.key, street.key)}
                                                                icon={<CloseOutlined />}
                                                                danger
                                                            />
                                                        }
                                                    </Space>
                                                </Col>
                                            ))
                                        )
                                    }
                                })}
                            </Row>
                        </div>
                    </Card>
                </div>
            </Card>
        </Spin>
    )
}

export default UpdateLocation