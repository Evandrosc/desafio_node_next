'use client'

import { useState } from "react";
import { ButtonSubmit } from "@/components/button-submit";

export default function HomePage() {
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)
  const [messagesSent, setMessagesSent] = useState(0)

  const handleScriptTransaction = async (event) => {
    event.preventDefault()
    setLoading(true)

    for (let i = 0; i < 10; i++) {
      const response = await fetch('/api/sqs', {
        method: 'POST',
        headers: {
          "Content-Type": 'text/plain',
        },
        body: 'transitions',
      })

      if (!response.ok) {
        setLoading(false)
        setErrorMessage(true)
        return
      }


      await new Promise(resolve => setTimeout(resolve, 5000));

      setMessagesSent(state => state + 10)
    }

    setLoading(false)

    setButtonDisabled(true)
    setSuccess(true)
  };

  return (
    <form onSubmit={handleScriptTransaction} className="flex flex-col items-center gap-3">
      <ButtonSubmit
        disabled={buttonDisabled || loading}
      >
        {loading ? 'Enviando' : 'Enviar 100 transações'}
      </ButtonSubmit>
      <span className="font-semibold text-xl">{messagesSent}/100</span>
      {success && <span className="text-green-600 font-semibold">Enviado com sucesso</span>}
      {errorMessage && <span className="text-red-600 font-semibold">Aconteceu um erro</span>}
    </form>
  )
};
