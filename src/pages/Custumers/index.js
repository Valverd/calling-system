import { useState } from "react";
import SideBar from "../../components/SideBar";
import Title from "../../components/Title";
import { addDoc, collection } from 'firebase/firestore'
import { FiUser } from 'react-icons/fi'
import { db } from "../../services/firebaseConnection";
import { toast } from "react-toastify";

export default function Custumers() {

    const [name, setName] = useState('')
    const [cnpj, setCnpj] = useState('')
    const [address, setAddress] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()
        if (name !== '' && cnpj !== '' && address !== '') {
            await addDoc(collection(db, 'custumers'), {
                name,
                cnpj,
                address
            })
                .then(() => {
                    setName('')
                    setCnpj('')
                    setAddress('')
                    toast.success('Empresa registrada!')
                })
                .catch((error) => {
                    console.log(error)
                    toast.error('Algo deu errado ao cadastrar!')
                })
        } else {
            toast.error('Preencha todos os campos!')
        }
    }

    return (
        <div>
            <SideBar />

            <div className="content">

                <Title name='Clientes'>
                    <FiUser size={25} />
                </Title>

                <div className="container" onSubmit={handleSubmit}>

                    <form className="form-profile">
                        <label>Nome Fantasia</label>
                        <input
                            type="text"
                            placeholder="Nome da Empresa"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />

                        <label>CNPJ</label>
                        <input
                            type="text"
                            placeholder="Digite o CNPJ"
                            value={cnpj}
                            onChange={e => setCnpj(e.target.value)}
                        />

                        <label>Endereço</label>
                        <input
                            type="text"
                            placeholder="Digite o Endereço da Empresa"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                        />

                        <button>Salvar</button>
                    </form>

                </div>

            </div>
        </div>
    )
}