import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '../../lib/prisma'
import { kv } from "@vercel/kv";

interface RedisResult {
  email: string;
  username: string;
  hashedPass: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.query.id !== 'POST') {
    const key = req.query.id as string
    const redisResult = await kv.get(key) as RedisResult || null;
    if (redisResult) {
      await handleRedisQuery(key, redisResult)
    }
  }
  res.redirect(process.env.SERVER_URL || 'http://localhost:3000')
}


export default handler

const handleRedisQuery = async (key: string, redisResult: RedisResult) => {
  const cachedAccount = {
    email: redisResult.email,
    username: redisResult.username,
    hashedPass: redisResult.hashedPass
  }

  if (
    !cachedAccount.email ||
    !cachedAccount.username ||
    !cachedAccount.hashedPass
  ) {
    return
  }
  try {
    await prisma.user.create({
      data: {
        username: cachedAccount.username,
        email: cachedAccount.email,
        passhash: cachedAccount.hashedPass
      }
    })
    kv.del(key)      
  } catch (error) {
    console.error(`Error creating user: ${error}`)
  }
}
