import { Layout, theme } from 'antd'
import AppRoutes from '../../routes/AppRoutes';
import { FooterSection } from '@layout/footer';
import { HeaderSection } from '@layout/header';
import { useSelector } from 'react-redux';
import { AuthState } from '@features/reducers/auth';
const { Content } = Layout

const AppLayout = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { isLogged } = useSelector((state: AuthState) => state.auth)

  return (
    <>
      <Layout className="site-layout">
        {isLogged && <HeaderSection />}


        <Content
          style={{
            margin: '2px 2px 0px 2px',
            padding: 15,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <AppRoutes />
        </Content>

        <FooterSection />
      </Layout>
    </>
  )
}

export default AppLayout