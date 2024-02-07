import { FiX } from 'react-icons/fi'
import './index.css'

export default function Modal({ content, close }) {
    console.log(content)
    return (
        <div className='modal'>
            <div className='container'>
                <button className='close' onClick={close}>
                    <FiX size={25} color='#fff' />
                    Voltar
                </button>

                <main>
                    <h2>Detalhes do chamado</h2>

                    <div className='row'>
                        <span>
                            Cliente: <i>{content.custumer}</i>
                        </span>
                    </div>
                    <div className='row'>
                        <span>
                            Assunto: <i>{content.subject}</i>
                        </span>
                        <span>
                            Cadastrado em: <i>{content.createdFormat}</i>
                        </span>
                    </div>
                    <div className='row'>
                     
                        <span>
                            Status: <i style={{ backgroundColor: content.status === 'Aberto' ? '#5cb85c' : content.status === 'Progresso' ? '#eead2d' : '#999' }}>{content.status}</i>
                        </span>
                    </div>

                    {content.complement !== '' &&
                        <>
                            <h3>Complemento</h3>
                            <p>{content.complement !== '' ? content.complement : 'Não há nenhum complemento'}</p>
                        </>
                    }
                </main>

            </div>
        </div>
    )
}