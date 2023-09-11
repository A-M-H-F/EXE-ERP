import React, { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import { ConfigProvider, Layout, message as messageApi, theme, App as AntdApp } from 'antd'
// import arabic from 'antd/locale/ar_EG'
import enUS from 'antd/locale/en_US'
import type { Locale } from 'antd/es/locale'
import { useDispatch } from 'react-redux'
import { AuthState } from '@features/reducers/auth'
import { TokenState } from '@features/reducers/token'
import { useSelector } from 'react-redux'
import { dispatchGetUser, dispatchLogin, dispatchLogout, fetchUserInfo } from '@features/actions/auth'
import apiService from './api'
import axios from 'axios'
import endUrl from '@utils/endUrl'
import { useSocket } from '@socket/provider/socketProvider'
import AppRoutes from './routes/AppRoutes'
import { AppLayout } from '@layout/appLayout'

const { Content } = Layout

axios.defaults.withCredentials = true;

function App() {
  const [locale] = useState<Locale>(enUS)
  // const changeLocale = (e: RadioChangeEvent) => {
  //   const localeValue = e.target.value;
  //   setLocale(localeValue);
  //   if (!localeValue) {
  //     dayjs.locale('en');
  //   } else {
  //     dayjs.locale('ar');
  //   }
  // }

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const themeConfig = {
    algorithm: [theme.darkAlgorithm, theme.defaultAlgorithm],
  }

  const dispatch = useDispatch()
  const auth = useSelector((state: AuthState) => state.auth)
  const token = useSelector((state: TokenState) => state.token)

  const { socketProvider, isConnected } = useSocket()

  React.useEffect(() => {
    const extreme = localStorage.getItem('extreme')
    if (extreme) {
      const getToken = async () => {
        const res = await axios.post(`${endUrl}/auth/extreme-ref`, null)
        dispatch({ type: 'GET_TOKEN', payload: res.data.access_token })
      }
      getToken()
    }
  }, [auth.isLogged, dispatch])

  React.useEffect(() => {
    if (token) {
      const getUser = async () => {
        dispatch(dispatchLogin())
        const res = await fetchUserInfo(token)
        dispatch(dispatchGetUser(res))

        socketProvider.emit("joinRoom", res.data._id);
      }
      getUser()
    }
  }, [token, dispatch])

  const handleFetchUserinfo = async () => {
    const token = await axios.post(`${endUrl}/auth/extreme-ref`, null)
    const res = await fetchUserInfo(token.data.access_token)
    dispatch(dispatchGetUser(res))
  }

  const handleUserLogoutEvent = async () => {
    try {
      const token = await axios.post(`${endUrl}/auth/extreme-ref`, null)
      const { data } = await apiService.GET('/auth/logout', token.data.access_token)

      const { message } = data

      messageApi.open({
        type: 'success',
        content: message,
      });

      dispatch(dispatchLogout())
      localStorage.removeItem('extreme')
      window.location.href = '/'
    } catch (error: any) {
      messageApi.open({
        type: 'error',
        content: await error?.response?.data?.message,
      });
    }
  }

  React.useEffect(() => {
    if (auth?.user?._id !== undefined && isConnected) {
      socketProvider.emit("joinRoom", auth?.user?._id);
    }
  }, [isConnected, auth])

  React.useEffect(() => {
    socketProvider.on('updateRole_to_client', async function ({
    }) {
      await handleFetchUserinfo()
    });

    socketProvider.on('updateUserRole_to_client', async function ({
    }) {
      await handleFetchUserinfo()
    });

    socketProvider.on('updateUserInfo_to_client', async function ({
    }) {
      await handleFetchUserinfo()
    });

    socketProvider.on('updateUserStatus_to_client', async function ({
    }) {
      await handleUserLogoutEvent()
    });

    socketProvider.on('updateUserPass_to_client', async function ({
    }) {
      await handleUserLogoutEvent()
    });

    return () => {
      socketProvider.off("updateRole_to_client", handleFetchUserinfo);
      socketProvider.off("updateUserRole_to_client", handleFetchUserinfo);
      socketProvider.off("updateUserInfo_to_client", handleFetchUserinfo);
      socketProvider.off("updateUserStatus_to_client", handleUserLogoutEvent);
      socketProvider.off("updateUserPass_to_client", handleUserLogoutEvent);
    }
  }, [])

  // const testButton = () => {
  //   const successMessage = "Task added successfully"
  //   messageApi.open({
  //     type: 'success',
  //     content: successMessage,
  //     duration: 2,
  //     // onClose: () => testButton()
  //   })

  //   // notificationApi['success']({
  //   //   message: '',
  //   //   description: successMessage,
  //   //   duration: 2,
  //   // });

  //   // const errorMessage = "Your account is disabled, please contact the support"
  //   // messageApi.open({
  //   //   type: 'error',
  //   //   content: errorMessage,
  //   // });
  // }

  const extreme = localStorage.getItem('extreme')

  return (
    <>
      <ConfigProvider locale={locale} theme={themeConfig}>
        <Router>
          <AntdApp>
            <Layout style={{ minHeight: '100vh', maxWidth: '99vw' }}>
              {!auth?.isLogged && !extreme
                ?
                <Layout className="site-layout">
                  <Content
                    style={{
                      padding: 20,
                      minHeight: 280,
                      background: colorBgContainer,
                    }}
                  >
                    <AppRoutes />
                  </Content>
                </Layout>
                :
                <>
                  <AppLayout />
                </>
              }
            </Layout>
          </AntdApp>
        </Router>
      </ConfigProvider>
    </>
  )
}

export default App
