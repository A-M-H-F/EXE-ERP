import {
  Avatar,
  AvatarBadge,
  Button,
  Center,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Stack,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { AiOutlineEye, AiOutlineUser } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { ViewUploadedPicture } from '../viewUploadedPicture'
import { ViewCurrentProfilePicture } from '../viewCurrentProfilePicture'
import useProfilePicture from '@utils/images/useProfilePicture'

const ChangeProfilePicture = () => {
  const { user } = useSelector((state: any) => state.auth)
  const toast = useToast()

  // uploaded profile picture
  const {
    isOpen: isOpenViewUploadedImage,
    onOpen: onOpenViewUploadedImage,
    onClose: onCloseViewUploadedImage
  } = useDisclosure()

  // current profile picture
  const {
    isOpen: isOpenViewCurrentImage,
    onOpen: onOpenViewCurrentImage,
    onClose: onCloseViewCurrentImage
  } = useDisclosure()

  const inputRef = useRef<HTMLInputElement | any>(null)
  const [updatingPicture, setUpdatingPicture] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File>()
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [isValidatingImage, setIsValidatingImage] = useState<boolean>(false);

  const handleUploadClick = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  const handleUploadPicture = (event: any) => {
    setUploadedFile(undefined)
    setPreviewUrl('')

    const imageFile = event.target.files[0];

    if (!imageFile) {
      return;
    }

    setIsValidatingImage(true)

    if (imageFile.size > 5 * 1024 * 1024) {
      // file size exceeded the limit
      toast({
        description: 'File size limit exceeded (max 5 MB)',
        status: 'error',
        duration: 3000,
        position: 'top-right',
        isClosable: true
      });
      setIsValidatingImage(true)
      return;
    }

    if (
      imageFile.type !== 'image/jpeg' &&
      imageFile.type !== 'image/jpg' &&
      imageFile.type !== 'image/webp'
    ) {
      toast({
        description: 'Only .jpeg, .jpg, and .webp files are allowed!',
        status: 'error',
        duration: 3000,
        position: 'top-right',
        isClosable: true
      })
      setIsValidatingImage(true)
      return
    }

    const previewUrl = URL.createObjectURL(imageFile)
    setPreviewUrl(previewUrl)

    setIsValidatingImage(false)

    setUploadedFile(imageFile)

    onOpenViewUploadedImage()
  }

  return (
    <>
      <ViewUploadedPicture
        previewUrl={previewUrl}
        isOpenViewUploadedImage={isOpenViewUploadedImage}
        onCloseViewUploadedImage={onCloseViewUploadedImage}
        updatingPicture={updatingPicture}
        isValidatingImage={isValidatingImage}
        setUpdatingPicture={setUpdatingPicture}
        uploadedFile={uploadedFile}
      />

      <ViewCurrentProfilePicture
        user={user}
        isOpenViewCurrentImage={isOpenViewCurrentImage}
        onCloseViewCurrentImage={onCloseViewCurrentImage}
      />

      <FormControl id="user-profile-picture">
        <FormLabel>Profile Picture</FormLabel>
        <Stack direction={['column', 'row']} spacing={6}>
          <Center>
            <Avatar size="xl"
              src={user?.picture === '' ? '' : useProfilePicture(user?.picture)}
              icon={user?.picture === '' ? <AiOutlineUser fontSize='1.5rem' /> : undefined}
            >
              <AvatarBadge
                as={IconButton}
                size="sm"
                rounded="full"
                top="-10px"
                colorScheme="green"
                aria-label="remove Image"
                icon={<AiOutlineEye />}
                onClick={onOpenViewCurrentImage}
              />
            </Avatar>
          </Center>
          <Center w="full">
            <Button w="full"
              onClick={handleUploadClick}
              isDisabled={updatingPicture}
            >
              {user?.picture === '' ? 'Add Picture' : 'Change Picture'}
            </Button>
          </Center>

          <Input
            ref={inputRef}
            display={'none'}
            type={'file'}
            name='image'
            onChange={handleUploadPicture}
            accept='.jpeg,.jpg,.webp'
          />
        </Stack>
      </FormControl>
    </>
  )
}

export default ChangeProfilePicture