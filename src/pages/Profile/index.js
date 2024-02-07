import { useContext, useState } from "react";
import SideBar from "../../components/SideBar";
import Title from "../../components/Title";

import { FiSettings, FiUpload } from 'react-icons/fi'
import { AuthContext } from "../../contexts/auth";
import avatar from '../../assets/usuario-em-branco.png'
import { toast } from "react-toastify";
import { doc, updateDoc } from 'firebase/firestore'
import { db, storage } from '../../services/firebaseConnection'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

import './index.css'

export default function Profile() {

    const { user, storageUser, setUser, logout } = useContext(AuthContext)
    const [avatarURL, setAvatarURL] = useState(user && user.avatarURL)
    const [imageAvatar, setImageAvatar] = useState(null)
    const [name, setName] = useState(user && user.name)
    const [email, setEmail] = useState(user && user.email)

    function handleFile(e) {
        if (e.target.files[0]) {
            const image = e.target.files[0]
            if (image.type === 'image/jpeg' || image.type === 'image/png') {
                setImageAvatar(image)
                setAvatarURL(URL.createObjectURL(image))
            } else {
                setImageAvatar(null)
                toast.error('Arquivo não suportado')
            }
        }
    }


    async function handleUpload() {

        const uploadRef = ref(storage, `images/${user.uid}/${imageAvatar.name}`)

        const uploadTask = uploadBytes(uploadRef, imageAvatar)
            .then((snapshot) => {
                getDownloadURL(snapshot.ref).then(async (downloadURL) => {

                    const docRef = doc(db, 'users', user.uid)
                    await updateDoc(docRef, {
                        avatarURL: downloadURL,
                        name
                    })
                        .then(() => {
                            let data = {
                                ...user,
                                avatarURL: downloadURL,
                                name
                            }
                            
                            setUser(data)
                            storageUser(data)
                            toast.success('Dados alterados')
                        })
                })
            })

    }


    async function handleSubmit(e) {
        e.preventDefault()

        //aqui eu só vou editar quando não seleciono nenhuma foto.
        if (imageAvatar === null && name !== '') {
            const docRef = doc(db, 'users', user.uid)
            await updateDoc(docRef, {
                name
            }).then(() => {
                let data = {
                    ...user,
                    name
                }
                setUser(data)
                storageUser(data)
                toast.success('Dados alterados')
            }).catch(() => {
                toast.error('Houve algum erro')
            })
        } else if (imageAvatar !== null) {
            handleUpload()
        }
    }

    return (
        <div>
            <SideBar />

            <div className="content">
                <Title name={'Minha Conta'}>
                    <FiSettings size={25} />
                </Title>

                <div className="container">

                    <form className="form-profile" onSubmit={handleSubmit}>

                        <label className="label-avatar">
                            <span>
                                <FiUpload color="#fff" size={25} />
                            </span>
                            <input type="file" accept="image/*" onChange={handleFile} />
                            <br />
                            {avatarURL === null ?
                                (<img src={avatar} alt="Foto de perfil" width={200} height={200} />)
                                :
                                (<img src={avatarURL} alt="Foto de perfil" width={250} height={250} />)
                            }

                        </label>

                        <label>Nome</label>
                        <input type='text' placeholder='Seu Nome' value={name} onChange={e => setName(e.target.value)} />

                        <label>Email</label>
                        <input type='text' placeholder='teste@teste.com' value={email} disabled={true} />

                        <button>Salvar</button>

                    </form>

                </div>

                <div className='container'>
                    <button className='logout-btn' onClick={() => logout()}>Sair</button>
                </div>

            </div>
        </div>
    )
}