import './index.css'
import logo from '../../assets/logo.png'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../contexts/auth'
import { toast } from 'react-toastify'

export default function SignIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { signIn, loadingAuth } = useContext(AuthContext)

    function handleSubmit(e) {
        e.preventDefault()

        if(email !== '' && password !== ''){
            signIn(email, password)
        } else {
            toast.error('Falta dados nos campos')
        }
    }


    return (
        <div className='container-center'>
            <div className='login'>
                <div className='login-area'>
                    <img src={logo} alt='logo do sistema de chamados' />
                </div>
                <form>
                    <h1>Entrar</h1>
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

                    <button type='submit' onClick={handleSubmit}>
                        {loadingAuth? "Carregando..." : "Acessar"}
                    </button>
                </form>

            <Link to={'/register'}>Criar uma conta</Link>

            </div>


        </div>
    )
}