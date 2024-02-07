import { useContext, useState } from "react"
import { Link } from "react-router-dom"
import logo from '../../assets/logo.png'
import { AuthContext } from "../../contexts/auth"

export default function SignUp() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { signUp, loadingAuth } = useContext(AuthContext)

    function handleSubmit(e) {
        e.preventDefault()

        if(name !== '' && email !== '' && password !== ''){
            signUp(name, email, password)
        }
    }

    return(
        <div className='container-center'>
            <div className='login'>
                <div className='login-area'>
                    <img src={logo} alt='logo do sistema de chamados' />
                </div>
                <form onSubmit={handleSubmit}>
                    <h1>Nova Conta</h1>
                    <input
                        type='text'
                        placeholder='Nome'
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <input
                        type='text'
                        placeholder='email@email.com'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />

                    <input
                        type='password'
                        placeholder='********'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />

                    <button type='submit'>
                        {loadingAuth ? 'Carregando ...' : 'Cadastrar'}
                    </button>
                </form>

            <Link to={'/'}>Ja possui uma conta? Faça login</Link>

            </div>


        </div>
    )
}