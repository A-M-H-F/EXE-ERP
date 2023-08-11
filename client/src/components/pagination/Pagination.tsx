import {
  AiOutlineDoubleLeft,
  AiOutlineDoubleRight,
} from "react-icons/ai";
import { ListItem, UnorderedList, VStack, IconButton } from '@chakra-ui/react';
import { DOTS, usePagination } from "../../utils/pagination/usePagination";

interface Props {
  onPageChange: (page: number) => void;
  totalCount: number;
  siblingCount?: number;
  currentPage: number;
  pageSize: number;
}

const Pagination = (props: Props) => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize
  } = props;

  const paginationRange: any = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  });

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];
  return (
    <VStack>
      <UnorderedList display={'flex'} listStyleType={'none'}>
        <ListItem>
          <IconButton
            icon={<AiOutlineDoubleLeft />}
            aria-label='next-left'
            onClick={onPrevious}
            isDisabled={currentPage === 1}
            bgColor={'blue'}
          />
        </ListItem>

        {paginationRange.map((pageNumber: any, index: any) => {
          if (pageNumber === DOTS) {
            return (
              <ListItem
                key={pageNumber + DOTS + index}
                cursor={'default'}
                bgColor={pageNumber === currentPage ? 'rgba(0, 0, 0, 0.08)' : 'transparent'}
                // as={'button'}
                _hover={{
                  cursor: 'default',
                  bgColor: 'rgba(0, 0, 0, 0.04)'
                }}
                padding={'0 20px'}
                height={'32px'}
                textAlign={'center'}
                margin={'auto 5px'}
                color={'white'}
                display={'flex'}
                boxSizing={'border-box'}
                alignItems={'center'}
                letterSpacing={'0.01071em'}
                borderRadius={'16px'}
                lineHeight={'1.43'}
                fontSize={'13px'}
                minW={'32px'}
              >
                &#8230;
              </ListItem>
            )
          }

          return (
            <ListItem
              key={pageNumber}
              cursor={'default'}
              bgColor={pageNumber === currentPage ? 'red' : 'transparent'}
              _hover={{
                cursor: 'pointer',
                // bgColor: 'rgba(0, 0, 0, 0.04)'
              }}
              padding={'0 12px'}
              height={'32px'}
              textAlign={'center'}
              margin={'auto 4px'}
              color={'white'}
              display={'flex'}
              boxSizing={'border-box'}
              alignItems={'center'}
              letterSpacing={'0.01071em'}
              borderRadius={'16px'}
              lineHeight={'1.43'}
              fontSize={'13px'}
              minW={'32px'}
              onClick={() => onPageChange(pageNumber)}
              as={'button'}
              disabled={pageNumber === currentPage}
            >
              {pageNumber}
            </ListItem>
          );
        })}

        <ListItem>
          <IconButton
            icon={<AiOutlineDoubleRight />}
            aria-label='next-right'
            onClick={onNext}
            isDisabled={currentPage === lastPage}
            bgColor={'blue'}
          />
        </ListItem>
      </UnorderedList>
    </VStack>
  );
};

export default Pagination;