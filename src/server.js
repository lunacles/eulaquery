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
    let data = ''

    req.on('data', chunk => data += chunk)

    req.on('end', () => {
      console.log('Received data:', data)
      try {
        let requestData = JSON.parse(data)
        let link = requestData.link
        if (!link)
          throw new Error('No link provided')

        https.get(link, res2 => {
          res2.pipe(res)
          res2.on('end', () => res.end())
        }).on('error', error => {
          console.error(error)
          res.statusCode = 500
          res.end('Error fetching the video')
        })
      } catch (error) {
        console.error('Error parsing JSON:', error)
        res.statusCode = 400
        res.end('Invalid JSON')
      }
    })
  } else {
    res.statusCode = 405
    res.end('Method Not Allowed')
  }
}).listen(3000)
