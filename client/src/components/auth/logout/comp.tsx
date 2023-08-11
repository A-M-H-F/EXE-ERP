import { MenuItem, useToast } from '@chakra-ui/react'
import { dispatchLogout } from '@features/actions/auth'
import endUrl from '@utils/endUrl'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

const Logout = () => {
    const toast = useToast()
    const token = useSelector((state: any) => state.token)
    const dispatch = useDispatch()

    const handleLogout = async () => {
        const { data } = await axios.get(`${endUrl}/auth/logout`, {
            headers: { Authorization: `Bearer ${token}` }
        })

        if (data) {
            toast({
                description: await data?.message,
                status: 'success',
                duration: 3000,
                position: 'top-right',
            })
        }
        dispatch(dispatchLogout())
        localStorage.removeItem('extreme')
        window.location.href = '/'
    }

    return (
        <>
            <MenuItem
                onClick={handleLogout}
                fontWeight={700}
                color={'red'}
            >
                Logout
            </MenuItem>
        </>
    )
}

export default Logout