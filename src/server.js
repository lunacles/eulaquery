import http from 'http'
import https from 'https'

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST')
    res.end()
    return
  }
  if (req.method === 'POST') {
    let chunks = []
    let src = ''
    req.on('data', chunk => {
      src += chunk
      chunks.push(chunk)
    })

    req.on('end', () => {
      let data = Buffer.concat(chunks)
      console.log('Received data:', data, src)
      try {
        let requestData = JSON.parse(src)
        let link = requestData.link
        if (!link)
          throw new Error('No link provided')

        https.get(link, res2 => {
          res2.pipe(res)
          res2.on('end', () => res.end())
        }).on('error', error => {
          console.error(error)
          res.writeHead(500)
          res.end('Error fetching the video')
        })
      } catch (error) {
        console.error('Error parsing JSON:', error)
        res.writeHead(400)
        res.end('Invalid JSON')
      }
    })
  } else {
    res.writeHead(405)
    res.end('Method Not Allowed')
  }
}).listen(3000)
