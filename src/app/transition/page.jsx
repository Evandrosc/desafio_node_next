'use client'

import { useState } from "react";
import { InputMoney } from "@/components/input-money";
import { ButtonSubmit } from "@/components/button-submit";

const methodPayment = {
  debit: 'debit',
  credit: 'credit'
}


export const formatMoney = (amount) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
};

export default function TransitionPage() {
  const [value, setValue] = useState(formatMoney(0));
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)

  const currencyNumber = parseFloat(value.replace(/[^\d]/g, '')) / 100

  function handlePaymentMethodChange(event) {
    setPaymentMethod(event.target.value);
  };

  function defaultValues() {
    setLoading(false)
    setValue(formatMoney(0))
    setPaymentMethod('')
  }

  async function handleTransition(event) {
    event.preventDefault()

    if (successMessage) {
      setSuccessMessage(false)
    }

    if (errorMessage) {
      setErrorMessage(false)
    }

    setLoading(true)

    const response = await fetch('/api/sqs', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentMethod, currencyNumber }),
    })

    defaultValues()

    if (!response.ok) {
      setErrorMessage(true)
      return
    }

    setSuccessMessage(true)
  }

  const buttonSubmitDisabled =
    currencyNumber <= 0 ||
    (paymentMethod !== methodPayment.debit && paymentMethod !== methodPayment.credit);


  return (
    <section className="flex flex-col items-center px-5">
      <h1 className="text-2xl font-semibold mb-10">Realizar transação</h1>
      <form onSubmit={handleTransition} className="flex flex-col gap-10">
        <InputMoney value={value} onValue={setValue} />
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <input
              type="radio"
              id={methodPayment.debit}
              name="paymentMethod"
              required
              value={methodPayment.debit}
              checked={paymentMethod === methodPayment.debit}
              onChange={handlePaymentMethodChange}
            />
            <label htmlFor={methodPayment.debit} className="font-semibold text-lg">Débito</label>
          </div>
          <div className="flex gap-2">
            <input
              type="radio"
              id={methodPayment.credit}
              name="paymentMethod"
              required
              value={methodPayment.credit}
              checked={paymentMethod === methodPayment.credit}
              onChange={handlePaymentMethodChange}
            />
            <label htmlFor={methodPayment.credit} className="font-semibold text-lg">Crédito</label>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <ButtonSubmit
            disabled={buttonSubmitDisabled || loading}
          >
            {loading ? 'Enviando' : 'Enviar'}
          </ButtonSubmit>
          {successMessage && <span className="text-green-600 font-semibold self-center">Enviado com sucesso</span>}
          {errorMessage && <span className="text-red-600 font-semibold self-center">Ocorreu um erro</span>}
        </div>
      </form>
    </section>
  )
}