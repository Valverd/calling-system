import { useContext, useEffect } from "react"
import { AuthContext } from "../../contexts/auth"
import { Link } from "react-router-dom"
import { FiHome, FiSettings, FiUser } from 'react-icons/fi'
import avatarImg from '../../assets/usuario-em-branco.png'

import './index.css'

export default function SideBar() {

    const { user } = useContext(AuthContext)

    return (
        <div className="sidebar">
            <div>
                <img src={user.avatarURL === null ? avatarImg : user.avatarURL} alt="Foto do usuario" />
            </div>

            <Link className="a1" to="/dashboard">
                <FiHome color="#fff" size={24} />
                Chamados
            </Link>

            <Link className="a2" to="/custumers">
                <FiUser color="#fff" size={24} />
                Clientes
            </Link>

            <Link className="a3" to="/profile">
                <FiSettings color="#fff" size={24} />
                Perfil
            </Link>
        </div>
    )
}