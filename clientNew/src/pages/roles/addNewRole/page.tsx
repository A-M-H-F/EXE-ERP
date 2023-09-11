import useDocumentMetadata from '../../../hooks/useDocumentMetadata'
import { AddNewRole } from '../components/addNewRole'

const AddNewRolePage = () => {
    useDocumentMetadata('EX - New Role', 'Extreme Engineering - Add New Role')
    return (
        <>
            <AddNewRole />
        </>
    )
}

export default AddNewRolePage