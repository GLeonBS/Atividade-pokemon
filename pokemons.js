import { writeFile } from "fs/promises"
class Pokemons{
    async getPoke() {
        const pokeList = await fetch('https://pokeapi.co/api/v2/pokemon?limit=2')
        pokeList.json().then(resolve => {
            writeFile('pokedex.json', JSON.stringify(resolve.results, null, 2))
        }).catch(erro => {
            console.error("Não deu :/ ", erro);
        })
    }
}

async function main() {
    new Pokemons().getPoke()
}

main()
