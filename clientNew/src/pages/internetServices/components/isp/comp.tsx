import apiService from '@api/index'
import { dispatchGetInternetServices } from '@features/actions/internetServices'
import { AuthState } from '@features/reducers/auth'
import { InternetServiceListState } from '@features/reducers/internetServices'
import { ISP } from '@features/reducers/isp'
import { TokenState } from '@features/reducers/token'
import { useSocket } from '@socket/provider/socketProvider'
import { App, Select } from 'antd'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

type UpdateInternetServiceIspProps = {
    id: string,
    isp: string,
    ispList: ISP[]
}

const UpdateInternetServiceIsp = ({ id, isp, ispList }: UpdateInternetServiceIspProps) => {
    const token = useSelector((state: TokenState) => state.token)
    const { message: messageApi } = App.useApp()
    const { socketProvider } = useSocket()
    const internetServicesList = useSelector((state: InternetServiceListState) => state.internetServicesList)
    const dispatch = useDispatch()
    const { user: currentUser } = useSelector((state: AuthState) => state.auth)

    const handleUpdateIsp = async (value: string) => {
        let ispName = ''
        ispList?.map((isp: ISP) => {
            if (isp._id === value) {
                ispName =  isp.name
            }
        })

        if (value === isp) {
            return
        }

        const body = {
            isp: value
        }

        try {
            const { data } = await apiService.PUT(`/internet-service/isp/${id}`, body, token)

            const { message } = data

            messageApi.open({
                type: 'success',
                content: message,
                duration: 2
            })

            const updatedList = [...internetServicesList].map((is: any) => {
                if (is._id === id) {
                    return { ...is, isp: { name: ispName, _id: value } }
                }
                return is
            })

            dispatch(dispatchGetInternetServices(updatedList))

            socketProvider.emit('getAllInternetServices_to_server', { userId: currentUser?._id })
        } catch (error: any) {

        }
    }

    return (
        <Select
            placeholder="Select ISP"
            optionLabelProp="label"
            value={isp === '' ? 'Select ISP' : isp}
            onChange={handleUpdateIsp}
            style={{
                width: '100%'
            }}
        >
            {ispList?.map((isp: any) => (
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
    )
}

export default UpdateInternetServiceIsp