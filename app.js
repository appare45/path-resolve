const args = process.argv.slice(2);
let targetPath = args[0];
if (args[0] === undefined) {
  targetPath = '.'
}

targetPath = targetPath.trim();
targetPath = targetPath.replace(/^\./, "./");
targetPath = targetPath.replace(/^\.\//, "/");
const path = require("path");
targetPath = path.parse(targetPath);
targetPath = path.join('.', targetPath.dir, targetPath.base);

const fs = require("fs");
const { resolve } = require("path");
if (path.extname(targetPath) == '') {
  const readDir = dirPath => {
    fs.readdir(dirPath, 'utf-8', (err, files) => {
      if (err) {
        console.error(`Error: ${err.message}`)
        process.exit()
      } else {

        files.filter(file => {
          return path.parse(file).ext === '.html'
        }).forEach(file => {
          fix(dirPath, file)
        })
        console.log(files.filter(file => {
          return path.parse(file).ext === '.html'
        }))
      }



      files.filter(async file => {
        async function dirSync() {
          return new Promise(resolve => {
            fs.stat
              (path.join(dirPath, file), (statErr, stats) => {
                if (statErr) {
                  console.error(`Stat error: ${statErr}`);
                  resolve(false);
                }
                else {
                  console.log(`${file} : ${stats.isDirectory()}`);
                  resolve(stats.isDirectory());
                }
              })
          })
        }
        async function result() {
          console.log(await dirSync())
          return (await dirSync())

        }
        await result().then(value => { return (value) })
      })

        .forEach(dir => {
          console.log(dir)
          readDir(dir)
        })
    })
  }
  readDir(targetPath)
}

const fix = (dir, file) => {
  const fullDir = path.join(dir, file)
  fs.readFile(fullDir, 'utf-8', (err, data) => {
    if (err) {
      console.error(`Error: ${err.message}`)
      process.exit()
    }
    let res = data
    res = res.replace(/="\//gm, '="./')
    res = res.replace(/='\//gm, "='./")
    const hrefMatches = res.match(/<a.+href=["']\.\/.[^.]+["'].?>/gm)
    if (!!hrefMatches) {
      hrefMatches.forEach(match => {
        res = res.replace(match, match.replace(/href="\.\/[^"]+/gm, '$&.html'))
        res = res.replace(match, match.replace(/href='\.\/[^']+/gm, '$&.html'))
      })
    }
    const hrefMatchesIndex = res.match(/<a.+href="\.\/">/gm)
    if (!!hrefMatchesIndex) {
      hrefMatchesIndex.forEach(match => {
        res = res.replace(match, match.replace(/href=["']\.\/["']/gm, 'href="./index.html"'))
      })
    }
    fs.writeFile(fullDir, res, 'utf-8', writeErr => {
      if (writeErr) {
        console.error(`Error: ${writeErr}`)
      }
    })
  })
  console.log(`Fixed ${fullDir}`)
} 