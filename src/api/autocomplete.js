import global from '../../public/global.js'

export let autoComplete = async (searchTerms) => {
  try {
    let url = new URL(global.api.url + 'autocomplete.php')
    url.searchParams.append('q', encodeURIComponent(searchTerms))
    let response = await fetch(url.toString())
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`)
    let json = await response.json()
    return json
  } catch (err) {
    console.error('Fetch error:', err)
    return null
  }
}
