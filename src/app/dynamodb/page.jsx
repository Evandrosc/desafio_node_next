'use client'

import { useState } from 'react'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/button';
import { ButtonSubmit } from '@/components/button-submit';

function formatBRLcurrency(number) {
  const convertToNumber = Number(number)

  return convertToNumber.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function DynamoDbPage() {
  const [loading, setLoading] = useState(false)
  const [dataDynamoDb, setDataDynamoDb] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [emptyDynamoDb, setEmptyDynamoDb] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)

  async function handleDataDynamoDB(event) {
    event.preventDefault()

    setLoading(true)

    if (errorMessage) {
      setErrorMessage(false)
    }

    if (emptyDynamoDb) {
      setEmptyDynamoDb(false)
    }

    const response = await fetch('/api/dynamodb')

    if (!response.ok) {
      setLoading(false)

      if (dataDynamoDb.length > 0) {
        setDataDynamoDb([])
      }

      setErrorMessage(true)
      return
    }

    const { Items } = await response.json()

    setLoading(false)

    if (Items.length === 0) {
      if (dataDynamoDb.length > 0) {
        setDataDynamoDb([])
      }
      setEmptyDynamoDb(true)
      return
    }

    const itemsOrder = Items.sort((a, b) => Number(b.timestamp.N) - Number(a.timestamp.N))
    setDataDynamoDb(itemsOrder)
  };


  const transitionsPerPage = 10
  const maxPageButtons = 5

  const totalPages = Math.ceil((dataDynamoDb.length || 0) / transitionsPerPage)

  const indexOfLastTransitions = currentPage * transitionsPerPage
  const indexOfFirstTransitions = indexOfLastTransitions - transitionsPerPage

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const firstPageButton = Math.max(
    Math.min(currentPage - Math.floor(maxPageButtons / 2), totalPages - maxPageButtons + 1),
    1
  )

  const lastPageButton = Math.min(
    firstPageButton + maxPageButtons - 1,
    totalPages
  )

  const pageButtons = []
  for (let i = firstPageButton; i <= lastPageButton; i++) {
    pageButtons.push(
      <button
        key={i}
        onClick={() => setCurrentPage(i)}
        className={`w-[50px] h-[50px] mt-[50px] mx-[10px] rounded-[50%] text-white cursor-pointer text-xl hover:bg-blue-500 ${i === currentPage ? 'bg-blue-500' : 'bg-gray-500'}`}
      >
        {i}
      </button>
    )
  }

  return (
    <section className='px-5'>
      <form onSubmit={handleDataDynamoDB} className='flex justify-center mb-8'>
        <ButtonSubmit
          disabled={loading}
        >
          {loading ? 'Buscando' : 'Buscar Dados dynamoDB'}
        </ButtonSubmit>
      </form>
      {dataDynamoDb.length > 0 && (
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-center">
            <thead className="text-xs text-white uppercase bg-blue-500">
              <tr>
                <th className="px-6 py-3">
                  IdempotencyId
                </th>
                <th className="px-6 py-3">
                  Type
                </th>
                <th className="px-6 py-3">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {dataDynamoDb
                .slice(indexOfFirstTransitions, indexOfLastTransitions)
                .map(({ idempotencyId, amount, type }) => (
                  <tr key={idempotencyId.S} className="bg-white border-b">
                    <td
                      className="px-6 py-4 font-medium whitespace-nowrap"
                    >{idempotencyId.S}</td>
                    <td
                      className="py-4 font-medium"
                    >{formatBRLcurrency(amount.N)}</td>
                    <td
                      className="px-6 py-4 font-medium"
                    >{type.S}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      {dataDynamoDb.length > 10 && (
        <div className='flex justify-center'>
          <Button func={prevPage} disabled={currentPage === 1}>
            <ChevronLeft size={28} />
          </Button>

          {pageButtons}

          <Button func={nextPage} disabled={currentPage === totalPages}>
            <ChevronRight size={28} />
          </Button>
        </div>)
      }

      {emptyDynamoDb && <span className="font-semibold text-xl text-center block my-5">DynamoDB vazio</span>}
      {errorMessage && <span className="text-red-600 font-semibold text-xl text-center block my-5">Ocorreu um erro</span>}
    </section>
  )
}
