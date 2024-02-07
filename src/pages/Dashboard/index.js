import './index.css'
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../contexts/auth"
import SideBar from "../../components/SideBar"
import Title from '../../components/Title'
import { FiEdit2, FiMessageSquare, FiPlus, FiSearch } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { collection, getDocs, limit, orderBy, query, startAfter } from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'
import { format } from 'date-fns'
import Modal from '../../components/Modal'


export default function Dashboard() {

    const [callList, setCallList] = useState([])
    const [loading, setLoading] = useState(true)
    const listRef = collection(db, 'call-list')

    const [isEmpty, setIsEmpty] = useState(false)
    const [lastDoc, setLastDoc] = useState()
    const [loadingMore, setLoadingMore] = useState(false)

    const [showModal, setShowModal] = useState(false)
    const [detail, setDetail] = useState()

    useEffect(() => {
        async function loadCallList() {
            const q = query(listRef, orderBy('created', 'desc'), limit(3))
            const querySnapshot = await getDocs(q)
            // fazer isso para não duplicar items devido ao react.strictMode
            setCallList([])
            await updateState(querySnapshot)
            setLoading(false)
        }

        loadCallList()
    }, [])


    async function updateState(querySnapshot) {
        if (querySnapshot.size !== 0) {
            let list = []
            querySnapshot.forEach((doc) => {

                list.push({
                    id: doc.id,
                    subject: doc.data().subject,
                    custumer: doc.data().custumer,
                    custumerID: doc.data().custumerID,
                    created: doc.data().created.seconds,
                    createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                    status: doc.data().status,
                    complement: doc.data().complement
                })

                //spread operator para adicionar os arquivos do array em um array ja existente salvo
                setCallList([...callList, ...list])
                setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1])
            })
        } else {
            setIsEmpty(true)
        }

        setLoadingMore(false)
    }

    async function handleMore() {
        setLoadingMore(true)
        const q = query(listRef, orderBy('created', 'desc'), startAfter(lastDoc), limit(3))
        const querySnapshot = await getDocs(q)
        await updateState(querySnapshot)
    }

    async function handleModal(item) {
        setDetail(item)
        setShowModal(!showModal)
    }

    if (loading) {
        return (
            <div>
                <SideBar />

                <div className='content'>
                    <Title name="Chamados">
                        <FiMessageSquare size={25} />
                    </Title>

                    <div className='container'>
                        <span>Buscando chamados...</span>
                    </div>
                </div>
            </div>
        )
    }


    return (
        <div>
            <SideBar />
            <div className="content">
                <Title name="Chamados">
                    <FiMessageSquare size={25} />
                </Title>


                {
                    callList.length === 0 ?

                        (
                            <div className='container dashboard'>
                                <span>Nenhum chamado encontrado...</span>
                                <Link className='new' to={'/new'}>
                                    <FiPlus size={25} color='#fff' />
                                    Novo Chamado
                                </Link>
                            </div>
                        )

                        :

                        (
                            <>

                                <Link className='new' to={'/new'}>
                                    <FiPlus size={25} color='#fff' />
                                    Novo Chamado
                                </Link>

                                <table>
                                    <thead>
                                        <tr>
                                            <th scope='col'>Clientes</th>
                                            <th scope='col'>Assunto</th>
                                            <th scope='col'>Status</th>
                                            <th scope='col'>Cadastrado em</th>
                                            <th scope='col'>#</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {callList.map((item, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td data-label='Cliente'>{item.custumer}</td>
                                                    <td data-label='Assunto'>{item.subject}</td>
                                                    <td data-label='Status'>
                                                        <span className='badge' style={{ backgroundColor: item.status === 'Aberto' ? '#5cb85c' : item.status === 'Progresso' ? '#eead2d' : '#999' }}>
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                    <td data-label='Cadastrado'>{item.createdFormat}</td>
                                                    <td data-label='#'>
                                                        <button className='action' style={{ backgroundColor: '#3583f6' }} onClick={() => handleModal(item)}>
                                                            <FiSearch size={17} color='#fff' />
                                                        </button>
                                                        <button className='action' style={{ backgroundColor: '#f6a935' }}>
                                                            <Link to={`/new/${item.id}`}>
                                                                <FiEdit2 size={17} color='#fff' />
                                                            </Link>
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>

                                </table>

                                {loadingMore && <div className='div-search-more'><h3>Buscando mais chamados...</h3></div>}
                                {!loadingMore && !isEmpty && <div className='div-btn-more'><button className='btn-more' onClick={handleMore}>Buscar Mais</button></div>}

                            </>
                        )
                }



            </div>

            {showModal &&
                <Modal
                    content={detail}
                    close={() => setShowModal(!showModal)}
                />
            }

        </div>
    )
}