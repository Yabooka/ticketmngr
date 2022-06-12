import { useQuery } from '@apollo/client'

import { GET_CLIENTS } from '../queries/clients'
import ClientRow from './ClientRow'

export default function Clients({ client }) {
  const { loading, error, data } = useQuery(GET_CLIENTS)

  if (loading)
    return (
      <div className='flex items-center justify-center space-x-2 animate-bounce'>
        <div className='w-8 h-8 bg-blue-400 rounded-full'></div>
        <div className='w-8 h-8 bg-green-400 rounded-full'></div>
        <div className='w-8 h-8 bg-black rounded-full'></div>
      </div>
    )
  if (error) return <p>Something Went Wrong</p>

  return (
    <>
      {data.clients.map((client) => (
        <ClientRow key={client.id} client={client} />
      ))}
    </>
  )
}
