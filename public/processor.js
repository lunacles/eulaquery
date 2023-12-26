// Fuck CORS
const processor = async (src) => {
  try {
    let response = await fetch('http://localhost:3000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ link: src })
    })
    let blob = await response.blob()
    let url = URL.createObjectURL(blob)
    let buffer = await blob.arrayBuffer().then(arrayBuffer => new Uint8Array(arrayBuffer))
    return { url, buffer }
  } catch (err) {
    console.error('Failed to retrieve video source.', err)
    return null
  }
}

export default processor
