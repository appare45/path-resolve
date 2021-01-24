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

const fs = require("fs")
if (path.extname(targetPath) == '') {
  fs.readdir(targetPath, 'utf-8', (err, files) => {
    if (err) {
      console.error(`Error: ${err.message}`)
      process.exit()
    }
    files.forEach(file => {
      if (path.parse(file).ext === '.html') {
        fix(targetPath, file)
      }
    })
  })
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
    fs.writeFile(fullDir, res, 'utf-8', writeErr => {
      if (writeErr) {
        console.error(`Error: ${writeErr}`)
      }
    })
  })
  console.log(`Fixed ${fullDir}`)
} 