import apiService from '@api/index';
import { TokenState } from '@features/reducers/token';
import useDocumentMetadata from '@hooks/useDocumentMetadata'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { UpdateRole } from '../components/updateRole';
import { App } from 'antd';

type RoleAccess = {
    id: number;
    page: string;
    crudPermissions: string[];
}

export type RoleData = {
    _id: string,
    name: string,
    access: RoleAccess[],
    createdAt: Date,
    updatedAt: Date
}

const RoleInfoPage = () => {
    const { roleId } = useParams()
    const token = useSelector((state: TokenState) => state.token)
    const { message: messageApi } = App.useApp()
    const [roleInfo, setRoleInfo] = useState<RoleData | any>()
    useDocumentMetadata(`EX - Role: ${roleInfo?.name}`, 'Extreme Engineering - Role Info')

    const getRoleInfo = async () => {
        try {
            const { data } = await apiService.GET(`/role/${roleId}`, token)

            setRoleInfo(data)
        } catch (error: any) {
            messageApi.open({
                type: 'error',
                content: await error?.response?.data?.message
            })
        }
    }

    useEffect(() => {
        getRoleInfo()
    }, [roleId])

    return (
        <>
            <UpdateRole roleInfo={roleInfo} />
        </>
    )
}

export default RoleInfoPage