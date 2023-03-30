import { writeFile, readFile } from "fs/promises"
class Pokemons {
    async getPoke() {
        const pokeList = await fetch('https://pokeapi.co/api/v2/pokemon?limit=2')

        pokeList.json().then(resolve => {
            writeFile('pokeUrl.json', JSON.stringify(resolve.results, null, 2))
        }).catch(erro => {
            console.error("Não deu :/ ", erro);
        })
    }

    async fetchAllPokemonData() {
        const pokeUrlList = JSON.parse(await readFile('pokeUrl.json', "utf-8"))

        const pokeList = pokeUrlList.map(async pokemon => {
            let url = pokemon.url

            const response = await fetch(url)
            const result = await response.json()

            const pokeStat = result.stats.map((pokeStat) => {
                return {
                    nameStat: pokeStat.stat.name,
                    value: pokeStat.base_stat
                }
            })

            const pokeType = result.types.map(typeIndex => {
                return typeIndex.type.name
            })
            const pokeData = {
                name: result.forms[0].name,
                dex: result.game_indices[9].game_indices,
                version: result.game_indices[9].version.name,
                height: result.height,
                weight: result.weight,
                stats: pokeStat,
                type: pokeType
            }

            return pokeData
        })
        const pokeListEsperada = await Promise.all(pokeList)

        pokeListEsperada.sort((a,b) => {
            return a.dex - b.dex
        })
        writeFile('pokedex.json', JSON.stringify(pokeListEsperada, null, 2))
    }
}

async function main() {
    new Pokemons().getPoke()
    new Pokemons().fetchAllPokemonData()
}

main()
