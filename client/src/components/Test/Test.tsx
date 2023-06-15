import { useEffect, useState } from 'react'
import { ListItem, OrderedList, useToast } from '@chakra-ui/react'
import { socketProvider } from '../../socketProvider';


const Test = () => {
  const toast = useToast();

  const [fooEvents, setFooEvents] = useState<any>([]);


  useEffect(() => {
    const handleAdminNotification = (message: any) => {
      setFooEvents((previous: any) => [message, ...previous]);

      // Handle the adminNotifications event
      toast({
        title: 'Notification',
        description: message,
        status: 'success',
        duration: 2000,
        position: 'top-right',
        isClosable: true,
      });
    };

    socketProvider.on("adminNotifications", handleAdminNotification);

    return () => {
      socketProvider.off("adminNotifications", handleAdminNotification);
      // disconnectSocket();
    };
  }, []);

  return (
    <>
      <OrderedList>
        {fooEvents && fooEvents?.map((event: any) => (
          <ListItem>{event}</ListItem>
        ))}
      </OrderedList>
    </>
  )
}

export default Test