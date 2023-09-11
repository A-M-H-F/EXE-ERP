import { LoginForm } from "@components/auth/loginForm"
import useDocumentMetadata from "@hooks/useDocumentMetadata"

const LoginPage = () => {
    useDocumentMetadata('EX - Login', 'Extreme Engineering - Login Page')
    return (
        <LoginForm />
    )
}

export default LoginPage