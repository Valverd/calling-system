import './index.css'
import { useNavigate, useParams } from 'react-router-dom';
import { FiPlusCircle } from "react-icons/fi";
import SideBar from "../../components/SideBar";
import Title from "../../components/Title";
import { useEffect, useState, useContext } from 'react';
import { addDoc, collection, getDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify';

export default function New() {

    const { user } = useContext(AuthContext)

    const [custumers, setCustumers] = useState([])
    const [loadCustumers, setLoadCustumers] = useState(true)
    const [custumerSelected, setCustumerSelected] = useState(0)

    const [status, setStatus] = useState('Aberto')
    const [subject, setSubject] = useState('Suporte')
    const [complement, setComplement] = useState('')
    const [idCustumer, setIdCustumer] = useState(false)

    const navigate = useNavigate()
    const { id } = useParams()
    const listaRef = collection(db, 'custumers')

    useEffect(() => {
        async function loadCustumers() {
            let docList = []

            await getDocs(listaRef)
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        docList.push({
                            id: doc.id,
                            name: doc.data().name
                        })
                    })
                    if (snapshot.docs.size === 0) {
                        setCustumers([{ id: '1', name: 'Nenhuma empresa encontrada' }])
                        setLoadCustumers(false)
                        return
                    }
                    //caso tenha acessado pelo editar, ele cai aqui com o id do chamado
                    if (id) {
                        loadId(docList)
                    }
                    setCustumers(docList)
                    setLoadCustumers(false)
                })

                .catch((error) => {
                    console.log(error)
                    setCustumers([{ id: '1', name: 'Nenhuma empresa encontrada' }])
                    setLoadCustumers(false)
                })

        }

        loadCustumers()
    }, [])

    async function loadId(list) {
        const docRef = doc(db, 'call-list', id)
        await getDoc(docRef)
            .then((snapshot) => {
                setSubject(snapshot.data().subject)
                setStatus(snapshot.data().status)
                setComplement(snapshot.data().complement)

                let index = list.findIndex(item => item.id === snapshot.data().custumerID)
                setCustumerSelected(index)
                setIdCustumer(true)
            })
            .catch((error) => {
                console.log(error)
                setIdCustumer(false)
            })
    }

    function handleOptionChange(e) {
        setStatus(e.target.value)
    }

    function handleChangeSubject(e) {
        setSubject(e.target.value)
    }

    function handleChangeCustumer(e) {
        setCustumerSelected(e.target.value)
    }

    async function handleRegister(e) {
        e.preventDefault()

        //editar um chamado existente
        if(idCustumer){
            const docRef = doc(db, 'call-list', id)
            await updateDoc(docRef, {
                custumer: custumers[custumerSelected].name,
                custumerID: custumers[custumerSelected].id,
                subject,
                complement,
                status,
                userID: user.uid    
            })
            .then(() => {
                toast.info("Chamado atualizado com sucesso!")
                setComplement('')
                setCustumerSelected(0)
                setStatus('Aberto')
                setSubject('Suporte')
                navigate('/dashboard')
            })
            .catch((error) => {
                console.log(error)
                toast.error('Ops, erro ao atualizar chamado!')
            })

            return
        }

        //registrar um novo chamado
        await addDoc(collection(db, 'call-list'), {
            created: new Date(),
            custumer: custumers[custumerSelected].name,
            custumerID: custumers[custumerSelected].id,
            subject,
            complement,
            status,
            userID: user.uid
        })
            .then(() => {
                toast.success("Chamado registrado!")
                setComplement('')
                setCustumerSelected(0)
                setStatus('aberto')
                setSubject('Suporte')
            })
            .catch((error) => {
                toast.error("Algo deu errado, tente novamente!")
                console.log(error)
            })
    }

    return (
        <div>
            <SideBar />

            <div className="content">
                <Title name={id ? 'Editando Chamado' :'Novo Chamado'}>
                    <FiPlusCircle size={25} />
                </Title>

                <div className="container">
                    <form className="form-profile" onSubmit={handleRegister}>
                        <label>Clientes</label>
                        {
                            loadCustumers ? (
                                <input
                                    disabled={true}
                                    value="Carregando..."
                                />
                            ) : (
                                <select value={custumerSelected} onChange={handleChangeCustumer}>
                                    {custumers.map((item, index) => {
                                        return (
                                            <option key={index} value={index}>
                                                {item.name}
                                            </option>
                                        )
                                    })}
                                </select>
                            )

                        }

                        <label>Assuntos</label>
                        <select value={subject} onChange={handleChangeSubject}>
                            <option value='Suporte'>Suporte</option>
                            <option value='Visita Tecnica'>Visita Tecnica</option>
                            <option value='Financeiro'>Financeiro</option>
                        </select>

                        <label>Status</label>
                        <div className="status">
                            <input
                                type="radio"
                                name="radio"
                                value="Aberto"
                                onChange={handleOptionChange}
                                checked={status === 'Aberto'}

                            />
                            <span>Aberto</span>
                            <input
                                type="radio"
                                name="radio"
                                value="Progresso"
                                onChange={handleOptionChange}
                                checked={status === 'Progresso'}

                            />
                            <span>Progresso</span>
                            <input
                                type="radio"
                                name="radio"
                                value="Atendido"
                                onChange={handleOptionChange}
                                checked={status === 'Atendido'}
                            />
                            <span>Atendido</span>
                        </div>

                        <label>Complementos</label>
                        <textarea
                            type="text"
                            placeholder="Descreva o seu problema (opcional)."
                            value={complement}
                            onChange={e => setComplement(e.target.value)}
                        />

                        <button type="submit">{ id? "Editar" : "Registrar"}</button>

                    </form>
                </div>
            </div>
        </div>
    )
}