import {
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  Stack,
  useDisclosure,
} from '@chakra-ui/react'
import { FiUsers } from 'react-icons/fi'
import { FaRegFile } from 'react-icons/fa'
import {
  MdHomeRepairService,
  MdOutlineInventory2,
  MdOutlineProductionQuantityLimits,
  MdOutlineUnsubscribe,
  MdWebAsset
} from 'react-icons/md'
import { AiOutlineHome, AiOutlineSecurityScan } from 'react-icons/ai'
import { IoNotificationsOutline } from 'react-icons/io5'
import { PiUsersFourLight } from 'react-icons/pi'
import { GoLocation } from 'react-icons/go'
import { TbCloudDataConnection } from 'react-icons/tb'
import { ImConnection } from 'react-icons/im'
import { LiaFileInvoiceDollarSolid, LiaFileInvoiceSolid } from 'react-icons/lia'
import { BsChatText, BsClipboard } from 'react-icons/bs'
import { MenuLink } from '@layout/menuLink'
import { SectionHeader } from '@layout/sectionHeader'
import { BiMenuAltLeft } from 'react-icons/bi'

const SideBar = () => {
  const {
    isOpen: isOpenSideBar,
    onOpen: onOpenSideBar,
    onClose: onCloseSideBar,
  } = useDisclosure()

  return (
    <>
      <IconButton
        variant='ghost'
        color='white'
        bgColor={'#3457D5'}
        aria-label='favorite-nan'
        fontSize='2.1em'
        p={'2'}
        icon={<BiMenuAltLeft />}
        _hover={{
          bg: '#002fa7',
          color: 'white',
          borderRadius: 10
        }}
        onClick={onOpenSideBar}
      />

      <Drawer
        isOpen={isOpenSideBar}
        placement="left"
        onClose={onCloseSideBar}
        size={'xs'}
      >
        <DrawerOverlay />
        <DrawerContent bgColor={'#3457D5'}>
          <DrawerHeader color={'white'}>Extreme Engineering</DrawerHeader>

          <DrawerBody p={5}>
            <Stack>
              {/* Dashboard */}
              <MenuLink
                mb={'0.1em'}
                path={'/'}
                title={'Dashboard'}
                iconSize={25}
                icon={<AiOutlineHome />}
              />

              {/* Users */}
              <MenuLink
                mb={'0.1em'}
                path={'/users'}
                title={'Users'}
                iconSize={25}
                icon={<FiUsers />}
              />

              {/* Roles */}
              <MenuLink
                mb={'0.1em'}
                path={'/roles'}
                title={'Roles'}
                iconSize={25}
                icon={<AiOutlineSecurityScan />}
              />

              {/* Scrum Boards */}
              <MenuLink
                mb={'0.1em'}
                path={'/boards'}
                title={'Scrum Boards'}
                iconSize={25}
                icon={<BsClipboard />}
              />

              {/* Chat Rooms */}
              <MenuLink
                mb={'0.1em'}
                path={'/chat/rooms'}
                title={'Chat Rooms'}
                iconSize={25}
                icon={<BsChatText />}
              />

              {/* Notifications */}
              <MenuLink
                mb={'0.1em'}
                path={'/notifications'}
                title={'Notifications'}
                iconSize={25}
                icon={<IoNotificationsOutline />}
              />

              {/* Logs */}
              <MenuLink
                mb={'0.1em'}
                path={'/logs'}
                title={'Logs'}
                iconSize={25}
                icon={<FaRegFile />}
              />

              <Divider />
              <SectionHeader title={'Company'} />

              {/* Customers */}
              <MenuLink
                mb={'0.1em'}
                path={'/customers'}
                title={'Customers'}
                iconSize={25}
                icon={<PiUsersFourLight />}
              />

              {/* Addresses */}
              <MenuLink
                mb={'0.1em'}
                path={'/addresses'}
                title={'Locations'}
                iconSize={25}
                icon={<GoLocation />}
              />

              {/* ISP */}
              <MenuLink
                mb={'0.1em'}
                path={'/isp'}
                title={'Internet Service Providers'}
                iconSize={25}
                icon={<TbCloudDataConnection />}
              />

              {/* Customers Subscriptions */}
              <MenuLink
                mb={'0.1em'}
                path={'/subscriptions'}
                title={'Customers Subscriptions'}
                iconSize={25}
                icon={<MdOutlineUnsubscribe />}
              />

              <Divider />
              <SectionHeader title={'Invoices'} />

              {/* Office Invoices */}
              <MenuLink
                mb={'0.1em'}
                path={'/invoices/office'}
                title={'Office Invoices'}
                iconSize={25}
                icon={<LiaFileInvoiceSolid />}
              />

              {/* Maintenance Invoices */}
              <MenuLink
                mb={'0.1em'}
                path={'/invoices/maintenance'}
                title={'Maintenance Invoices'}
                iconSize={25}
                icon={<LiaFileInvoiceSolid />}
              />

              {/* Subscription Invoices */}
              <MenuLink
                mb={'0.1em'}
                path={'/invoices/subscription'}
                title={'Subscription Invoices'}
                iconSize={25}
                icon={<LiaFileInvoiceDollarSolid />}
              />

              <Divider />
              <SectionHeader title={'Services'} />

              {/* Extreme Engineering Services */}
              <MenuLink
                mb={'0.1em'}
                path={'/services/it'}
                title={'IT Services'}
                iconSize={25}
                icon={<MdHomeRepairService />}
              />

              {/* Internet Service */}
              <MenuLink
                mb={'0.1em'}
                path={'/services/internet'}
                title={'Internet Services'}
                iconSize={25}
                icon={<ImConnection />}
              />

              <Divider />
              <SectionHeader title={'Products'} />

              {/* Products */}
              <MenuLink
                mb={'0.1em'}
                path={'/products'}
                title={'Products'}
                iconSize={25}
                icon={<MdOutlineProductionQuantityLimits />}
              />

              {/* Products Inventory */}
              <MenuLink
                mb={'0.1em'}
                path={'/products/inventory'}
                title={'Products Inventory'}
                iconSize={25}
                icon={<MdOutlineInventory2 />}
              />

              <Divider />
              <SectionHeader title={'Assets'} />

              {/* Assets */}
              <MenuLink
                mb={'0.1em'}
                path={'/assets'}
                title={'Assets'}
                iconSize={25}
                icon={<MdWebAsset />}
              />

              {/* Assets Inventory */}
              <MenuLink
                mb={'0.1em'}
                path={'/assets/inventory'}
                title={'Assets Inventory'}
                iconSize={25}
                icon={<MdOutlineInventory2 />}
              />

            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideBar