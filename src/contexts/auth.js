import { createContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth, db } from "../services/firebaseConnection";
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


export const AuthContext = createContext({})


function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loadingAuth, setLoadingAuth] = useState(false)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        async function loadUser() {
            const storageUser = localStorage.getItem('calling-system')

            if(storageUser) {
                setUser(JSON.parse(storageUser))
                setLoading(false)
            }

            setLoading(false)
        }

        loadUser()
     }, [])


    async function signIn(email, password) {
        await signInWithEmailAndPassword(auth, email, password)
            .then(async (value) => {
                let uid = value.user.uid

                // no firebase eu tenho que referenciar o documento para poder pega-lo
                const docRef = doc(db, 'users', uid)
                const returnDoc = await getDoc(docRef)

                // como o data do returndoc é um método, deve ser entre paresteses como função
                let data = {
                    uid,
                    name: returnDoc.data().name,
                    email: value.user.email,
                    avatarURL: returnDoc.data().avatarURL
                }
                
                setUser(data)
                storageUser(data)
                setLoadingAuth(false)
                toast.success('Seja bem vindo ao sistema!')
                navigate('/dashboard')
            })
            .catch((error) => {
                console.log(error)
                setLoadingAuth(false)
                toast.error('Usuário ou senha digitados errado!')
            })
    }

    async function signUp(name, email, password) {
        setLoadingAuth(true)
        await createUserWithEmailAndPassword(auth, email, password)
            .then(async (value) => {
                let uid = value.user.uid
                await setDoc(doc(db, 'users', uid), {
                    name: name,
                    avatarURL: null
                })
                    .then(() => {
                        let data = {
                            uid,
                            name,
                            email,
                            avatarURL: null
                        }

                        setUser(data)
                        storageUser(data)
                        toast.success('Seja bem vindo ao sistema!')
                        setLoadingAuth(false)
                        navigate('/dashboard')
                    })
            })
            .catch((error) => {
                toast.error('Algo deu errado!')
                console.log(error)
                setLoadingAuth(false)
            })

    }

    function storageUser(data) {
        localStorage.setItem('calling-system', JSON.stringify(data))
    }

    async function logout() {
        await signOut(auth)
        localStorage.removeItem('calling-system')
        setUser(null)
    }

    return (
        <AuthContext.Provider
            value={{
                signed: !!user, //!! serve para converter em booleano, false para null e true com dados
                user,
                signUp,
                signIn,
                loadingAuth,
                loading,
                logout,
                storageUser,
                setUser
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider