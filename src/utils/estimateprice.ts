import { encode } from 'gpt-3-encoder'

export const estimatePrice = (text: string, pricePerToken = 0.0001 / 1000) => {
  const encoded = encode(text)
  const price = encoded.length * pricePerToken

  return price
}



