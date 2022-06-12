import { useMutation } from '@apollo/client'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { ADD_CLIENT } from '../mutations/clientMutations'
import { GET_CLIENTS } from '../queries/clients'

export default function AddClientModal() {
  let [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const [addClient] = useMutation(ADD_CLIENT, {
    variables: { name, email, phone },
    update(cache, { data: { addClient } }) {
      const { clients } = cache.readQuery({ query: GET_CLIENTS })
      cache.writeQuery({
        query: GET_CLIENTS,
        data: { clients: [...clients, addClient] },
      })
    },
  })

  const onSubmit = (e) => {
    e.preventDefault()
    if (name === '' || email === '' || phone === '') {
      return alert('Please fill in all fields!')
    }

    addClient(name, email, phone)

    setName('')
    setEmail('')
    setPhone('')
  }

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <>
      <div className='fixed inset-0 flex items-center justify-center'>
        <button
          type='button'
          onClick={openModal}
          className='rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'
        >
          Add new client
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                  <Dialog.Title
                    as='h3'
                    className='text-lg font-medium leading-6 text-gray-900'
                  >
                    Add New Client
                  </Dialog.Title>
                  <div className='mt-2'>
                    <form onSubmit={onSubmit}>
                      <div className='grid grid-cols-1 gap-6'>
                        <label className='block'>
                          <span className='text-gray-700'>Full name</span>
                          <input
                            type='text'
                            id='name'
                            className='mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black'
                            placeholder='Your full name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </label>
                        <label className='block'>
                          <span className='text-gray-700'>Email address</span>
                          <input
                            type='text'
                            id='email'
                            className='mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black'
                            placeholder='Your email address'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </label>
                        <label className='block'>
                          <span className='text-gray-700'>Phone number</span>
                          <input
                            type='text'
                            id='phone'
                            className='mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black'
                            placeholder='Your phone number'
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </label>
                      </div>
                      <button
                        type='submit'
                        className='inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                        onClick={closeModal}
                      >
                        Got it, thanks!
                      </button>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
