import * as React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { Grid, GridItem } from '@chakra-ui/react'
import { AppRoutes } from './routes'
import { Header } from '@layout/header'
import endUrl from '@utils/endUrl'
import { dispatchGetUser, dispatchLogin, fetchUserInfo } from '@features/actions/auth'

axios.defaults.withCredentials = true;

function App() {
  const dispatch = useDispatch()
  const auth = useSelector((state: any) => state.auth)
  const token = useSelector((state: any) => state.token)

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
      }
      getUser()
    }
  }, [token, dispatch])

  return (
    <>
      <Router>
        <Grid
          templateAreas={`"header header"
                  "main main"
                  "footer footer"`}
          gridTemplateRows={'59px 1fr 30px'}
          gridTemplateColumns={'150px 1fr'}
          h='100vh'
          w='100%'
          gap='0'
        >
          <GridItem area={'header'}>
            <Header />
          </GridItem>

          <GridItem pb={20} area={'main'} >
            <AppRoutes />
          </GridItem>

          <GridItem area={'footer'}>
            {/* <Footer /> */}
          </GridItem>
        </Grid>
      </Router>
    </>
  );
}

export default App
