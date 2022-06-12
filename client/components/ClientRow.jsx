import { useMutation } from '@apollo/client'
import { FaTrash } from 'react-icons/fa'

import { DELETE_CLIENT } from '../mutations/deleteClient'
import { GET_CLIENTS } from '../queries/clients'

export default function ClientRow({ client }) {
  const [deleteClient] = useMutation(DELETE_CLIENT, {
    variables: { id: client.id },
    update(cache, { data: { deleteClient } }) {
      const { clients } = cache.readQuery({ query: GET_CLIENTS })
      cache.writeQuery({
        query: GET_CLIENTS,
        data: {
          clients: clients.filter((client) => client.id !== deleteClient.id),
        },
      })
    },
  })
  return (
    <div className='flex max-w-4xl mx-auto justify-between items-center'>
      <div>{client.name}</div>
      <div>{client.email}</div>
      <div>{client.phone}</div>
      <button className='btn' onClick={deleteClient}>
        <FaTrash />
      </button>
    </div>
  )
}
