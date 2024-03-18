import { SendMessageBatchCommand } from '@aws-sdk/client-sqs';
import { queueUrl, sqsClient } from './config';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const methodPayment = {
  debit: 'debit',
  credit: 'credit'
}

function GenerateTransitions() {
  const messages = [];

  const now = Date.now();
  let increment = now;

  for (let i = 0; i < 10; i++) {
    const uuid = uuidv4()

    const type = i % 2 === 0 ? 'credit' : 'debit';
    const messageBody = {
      idempotencyId: uuid,
      amount: Math.floor(Math.random() * 1000),
      type: type,
      timestamp: increment
    };

    messages.push({
      Id: uuid,
      MessageBody: JSON.stringify(messageBody),
      MessageGroupId: 'transacoes',
      MessageDeduplicationId: `transacao-${uuid}`,
    });

    increment++
  }
  return messages;
}

function GenerateTransition(paymentMethod, currency) {
  if (!methodPayment[paymentMethod] || currency <= 0) {
    return null
  }

  const messages = [];

  const uuid = uuidv4()

  const now = Date.now();
  let increment = now;


  const messageBody = {
    idempotencyId: uuid,
    amount: currency,
    type: paymentMethod,
    timestamp: increment
  };

  messages.push({
    Id: uuid,
    MessageBody: JSON.stringify(messageBody),
    MessageGroupId: 'transitions',
    MessageDeduplicationId: `transition-${uuid}`,
  });

  return messages;
}

function responseSuccess() {
  return new NextResponse(JSON.stringify({ success: true }), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function responseError(error, status) {
  return NextResponse.json({ error: error.message }, { status: status, statusText: error.message, })
}


export async function POST(req) {
  const contentType = req.headers.get('content-type');

  const body = contentType === 'application/json' 
    ? await req.json() 
    : await new Response(req.body).text()

  const messages = body === 'transitions' 
    ? GenerateTransitions() 
    : GenerateTransition(body.paymentMethod, body.currencyNumber)

  if (!messages) {
    const newError = new TypeError('Erro forma de pagamento') 
    return responseError(newError, 422)
  }

  const batchSize = 10;

  for (let i = 0; i < messages.length; i += batchSize) {
    const batch = messages.slice(i, i + batchSize);
    const params = {
      Entries: batch,
      QueueUrl: queueUrl,
    };

    try {
      const command = new SendMessageBatchCommand(params);
      await sqsClient.send(command);
      return responseSuccess()
    } catch (error) {
      return responseError(error, 500)
    }
  }
}