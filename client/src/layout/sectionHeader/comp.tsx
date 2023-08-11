import React from 'react'
import { Box, Heading } from '@chakra-ui/react'

interface SectionHeaderProps {
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  return (
    <Box>
      <Heading size={'md'} color={'white'} fontWeight={'medium'} mt={'0.5em'}>
        {title}
      </Heading>
    </Box>
  )
}

export default SectionHeader