const https = require('https')
const fs = require('fs')

// geoBoundaries stores files via Git LFS. The raw.githubusercontent.com host
// returns only the LFS *pointer*; the github.com/.../raw/... host redirects to
// the resolved content on media.githubusercontent.com — so we must follow
// redirects (Node's https.get does not do this automatically).
const url =
  'https://github.com/wmgeolab/geoBoundaries/raw/main/releaseData/gbOpen/UGA/ADM1/geoBoundaries-UGA-ADM1_simplified.geojson'

const dest = 'public/uganda-districts.geojson'

function download(currentUrl, redirects = 0) {
  if (redirects > 5) {
    console.error('Download failed: too many redirects')
    process.exit(1)
  }

  https
    .get(currentUrl, (res) => {
      // Follow redirects.
      if (
        res.statusCode >= 300 &&
        res.statusCode < 400 &&
        res.headers.location
      ) {
        res.resume() // discard body
        return download(res.headers.location, redirects + 1)
      }

      if (res.statusCode !== 200) {
        console.error(`Download failed: HTTP ${res.statusCode}`)
        res.resume()
        process.exit(1)
      }

      const file = fs.createWriteStream(dest)
      res.pipe(file)
      file.on('finish', () => {
        file.close(() => {
          const bytes = fs.statSync(dest).size
          const head = fs.readFileSync(dest, 'utf8').slice(0, 1)
          if (bytes < 1000 || head !== '{') {
            console.error(
              `Download produced invalid GeoJSON (${bytes} bytes, starts with "${head}")`
            )
            process.exit(1)
          }
          console.log(
            `Downloaded ${dest} (${(bytes / 1024).toFixed(1)} KB)`
          )
        })
      })
    })
    .on('error', (err) => {
      console.error('Download failed:', err.message)
      process.exit(1)
    })
}

download(url)
