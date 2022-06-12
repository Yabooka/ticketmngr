import AddClientModal from '../components/AddClient'
import ClientOnly from '../components/ClientOnly'
import Clients from '../components/Clients'
import Header from '../components/Header'

export default function Home() {
  return (
    <>
      <Header />
      <AddClientModal />
      <ClientOnly>
        <Clients />
      </ClientOnly>
    </>
  )
}
