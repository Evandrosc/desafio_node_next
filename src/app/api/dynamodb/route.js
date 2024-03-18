import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { dynamoDBClient } from "./config";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

export const GET = async () => {
   const params = {
      TableName: 'desafio',
   };

   try {
      const command = new ScanCommand(params);
      const { Items } = await docClient.send(command);

      return new NextResponse(JSON.stringify({ Items }));

   } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500, statusText: 'Erro ao buscar dados dynamoDB', })
   }

};
