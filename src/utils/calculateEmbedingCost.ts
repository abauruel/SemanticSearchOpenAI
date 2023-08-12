import { movies } from '../data/movies.json'
import { estimatePrice } from './estimateprice'

const run = async () => {
  const textToEmbed = movies.map((movie) => {
    `Title:${movie.movie_name}\n\nyear:${movie.year}\n\nactors: ${movie.actors.join(',')}\n\nstoryline: ${movie.storyline}\n\n`
  })
  const price = estimatePrice(textToEmbed.join("\n\n"))

  const notacaoCientifica = /^[+\-]?\d+(\.\d+)?[eE][+\-]?\d+$/.test(price.toString());
  if (notacaoCientifica) {
    const numberFloat = parseFloat(price.toString())
    const numeroDecimal = price * Math.pow(10, Number(numberFloat.toString().split('e')[1]));
    console.log(numeroDecimal.toString())
    console.log(numberFloat);
    //8.000000000000001e-7
  } else {
    console.log(price.toString());
  }


}

run()