import { TokenState } from '@features/reducers/token'
import { useSocket } from '@socket/provider/socketProvider'
import { App, Form, Input, Modal, Select, Spin, Tooltip, message } from 'antd'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { HiOutlineOfficeBuilding } from 'react-icons/hi'
import apiService from '@api/index'
import { AuthState } from '@features/reducers/auth'
import { dispatchGetInternetServices } from '@features/actions/internetServices'
import { dispatchGetISP, fetchISP } from '@features/actions/isp'
import { ISP, ISPListState } from '@features/reducers/isp'
import { CloudServerOutlined, DollarOutlined, EditOutlined, WifiOutlined } from '@ant-design/icons'
import { InternetService, InternetServiceListState } from '@features/reducers/internetServices'
import { checkLength, checkWhiteSpaces, isLessThan } from '@utils/stringCheck'

type InitialStateProps = {
  name: string,
  isp: string,
  service: string,
  cost: number,
  price: number,
  moreInfo: string,
}

type UpdateInternetServiceProps = {
  interService: InternetService
}

const UpdateInternetService = ({ interService }: UpdateInternetServiceProps) => {
  const token = useSelector((state: TokenState) => state.token)
  const { message: messageApi } = App.useApp()
  const { socketProvider } = useSocket()
  const dispatch = useDispatch()
  const { user: currentUser } = useSelector((state: AuthState) => state.auth)
  const ispList = useSelector((state: ISPListState) => state.ispList)
  const filteredIspList = ispList?.filter((isp: ISP) => isp?.status === 'active')
  const internetServicesList = useSelector((state: InternetServiceListState) => state.internetServicesList)

  const initialState: InitialStateProps = {
    name: interService.name,
    isp: interService.isp._id,
    service: interService.service,
    cost: interService.cost,
    price: interService.price,
    moreInfo: interService.moreInfo || '',
  }

  useEffect(() => {
    fetchISP(token).then((res: ISP[]) => {
      dispatch(dispatchGetISP(res))
    })
  }, [])

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  // loading
  const [updating, setUpdating] = useState<boolean>(false)

  // state
  const [internetServiceInfo, setInternetServiceInfo] = useState<InitialStateProps>(initialState)
  const {
    name,
    isp,
    service,
    cost,
    price,
    moreInfo,
  } = internetServiceInfo

  const handleInputChange = (e: any) => {
    const { name, value } = e.target

    if (name === 'price' || name === 'cost') {
      setInternetServiceInfo({ ...internetServiceInfo, [name]: Number(value) })
    } else {
      setInternetServiceInfo({ ...internetServiceInfo, [name]: String(value) })
    }
  }

  const handleIspChange = (value: string) => {
    setInternetServiceInfo({ ...internetServiceInfo, ['isp']: String(value) })
  }

  const handleUpdateInternetService = async () => {
    // name
    const nameWhiteSpaceCheck = checkWhiteSpaces(name)
    const nameLength = checkLength(name, 2)
    if (nameWhiteSpaceCheck) {
      messageApi.open({
        type: 'error',
        content: 'Name should not contain only whitespace'
      })
      return
    }
    if (nameLength) {
      messageApi.open({
        type: 'error',
        content: 'Name must be at least 3 characters long'
      })
      return
    }

    // service
    const serviceWhiteSpaceCheck = checkWhiteSpaces(service)
    const serviceLength = checkLength(service, 2)
    if (serviceWhiteSpaceCheck) {
      messageApi.open({
        type: 'error',
        content: 'Service should not contain only whitespace'
      })
      return
    }
    if (serviceLength) {
      messageApi.open({
        type: 'error',
        content: 'Service must be at least 2 characters long'
      })
      return
    }

    const isLessThanPrice = isLessThan(price, 0)
    const isLessThanCost = isLessThan(cost, 0)
    const isLessThanPriceCost = isLessThan(price, cost)
    if (isLessThanPrice) {
      message.open({
        type: 'error',
        content: 'Please add a price'
      })
      return
    }
    if (isLessThanCost) {
      message.open({
        type: 'error',
        content: 'Please add a cost'
      })
      return
    }

    if (isLessThanPriceCost) {
      messageApi.open({
        type: 'error',
        content: 'Price should be greater/equal to the cost'
      })
      return;
    }

    if (!isp || isp === '') {
      messageApi.open({
        type: 'error',
        content: 'Please choose ISP'
      })
      return
    }

    const body = {
      name,
      isp,
      service,
      cost,
      price,
      moreInfo,
    }

    try {
      setUpdating(true)

      const { data } = await apiService.PUT(`/internet-service/${interService?._id}`, body, token)

      const { message, newInternetService } = data

      messageApi.open({
        type: 'success',
        content: message,
        duration: 2
      })

      const updatedList = [...internetServicesList].map((is: any) => {
        if (is._id === interService?._id) {
          return { ...newInternetService }
        }
        return is
      })

      dispatch(dispatchGetInternetServices(updatedList))

      socketProvider.emit('getAllInternetServices_to_server', { userId: currentUser?._id })

      handleCancel()
      setUpdating(false)
    } catch (error: any) {
      setUpdating(false)
      messageApi.open({
        type: 'error',
        content: error?.response?.data?.message
      })
    }
  }

  return (
    <>
      <Tooltip title={'Update Internet Service Info'}>
        <EditOutlined
          onClick={showModal}
          disabled={updating}
        />
      </Tooltip>

      <Modal
        title="Internet Service"
        open={isModalOpen}
        onOk={handleUpdateInternetService}
        onCancel={handleCancel}
        centered
        confirmLoading={updating}
        okText='Save'
      >
        <Form
          layout='vertical'
          onFinish={handleUpdateInternetService}
        >
          <Spin spinning={updating}>
            <Form.Item
              label='Name'
              required
            >
              <Input
                name='name'
                value={name}
                onChange={handleInputChange}
                placeholder='IS name'
                prefix={<WifiOutlined />}
              />
            </Form.Item>

            <Form.Item
              label='Service'
              required
            >
              <Input
                name='service'
                value={service}
                onChange={handleInputChange}
                placeholder='service'
                prefix={<CloudServerOutlined />}
              />
            </Form.Item>

            <Form.Item
              label='ISP'
              required
            >
              <Select
                placeholder="Select ISP"
                optionLabelProp="label"
                value={isp === '' ? 'Select ISP' : isp}
                onChange={handleIspChange}
                suffixIcon={<HiOutlineOfficeBuilding />}
              >
                {filteredIspList?.map((isp: any) => (
                  <Select.Option
                    label={isp?.name}
                    value={isp?._id}
                    name={'isp'}
                    key={isp?._id}
                  >
                    {isp?.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label='Cost'
              required
            >
              <Input
                name='cost'
                type='number'
                value={cost}
                onChange={handleInputChange}
                placeholder='$000'
                prefix={<DollarOutlined />}
                min={0}
              />
            </Form.Item>

            <Form.Item
              label='Price'
              required
            >
              <Input
                name='price'
                type='number'
                value={price}
                onChange={handleInputChange}
                placeholder='$000'
                prefix={<DollarOutlined />}
                min={0}
              />
            </Form.Item>

            <Form.Item
              label='More Info'
              required
            >
              <Input.TextArea
                name='moreInfo'
                value={moreInfo}
                onChange={handleInputChange}
                placeholder='description / more info'
                maxLength={1200}
                autoSize={{ minRows: 3, maxRows: 6 }}
              />
            </Form.Item>
          </Spin>
        </Form>
      </Modal>
    </>
  )
}

export default UpdateInternetService