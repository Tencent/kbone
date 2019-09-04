const path = require('path')

const join = path.join
const basename = path.basename
const fs = require('fs')
const vfs = require('vinyl-fs')

const renameSync = fs.renameSync
const existsSync = fs.existsSync
const chalk = require('chalk')
const through = require('through2')
const emptyDir = require('empty-dir')
const info = require('./logger').info
const error = require('./logger').error
const success = require('./logger').success
const isCnFun = require('./utils').isCnFuc

const checkAppName = require('./utils').checkAppName
const isSafeToCreateProjectIn = require('./utils').isSafeToCreateProjectIn

function init(args) {
    const KboneCli = chalk.bold.cyan('Kbone-Cli')
    const isCn = isCnFun(args.language)
    const customPrjName = args.project || ''
    const tpl = join(__dirname, '../template/app')
    const dest = join(process.cwd(), customPrjName)
    const projectName = basename(dest)
    const mirror = args.mirror

    console.log()
    console.log(KboneCli + (!isCn ? ' is booting... ' : ' 正在启动...'))
    console.log(
        KboneCli + (!isCn ? ' will execute init command... ' : ' 即将执行 init 命令...')
    )
    checkAppName(projectName)
    if (existsSync(dest) && !emptyDir.sync(dest)) {
        if (!isSafeToCreateProjectIn(dest, projectName)) {
            process.exit(1)
        }
    }

    createApp()

    function createApp() {
        console.log()
        console.log(
            chalk.bold.cyan('Kbone-Cli') + (!isCn ? ' will creating a new kbone app in ' : ' 即将创建一个新的应用在 ') + dest
        )

        vfs
            .src(['**/*', '!node_modules/**/*'], {
                cwd: tpl,
                cwdbase: true,
                dot: true
            })
            .pipe(template(dest, tpl))
            .pipe(vfs.dest(dest))
            .on('end', function() {
                try {
                    info('Rename', 'gitignore -> .gitignore')
                    renameSync(join(dest, 'gitignore'), join(dest, '.gitignore'))
                    if (customPrjName) {
                        try {
                            // eslint-disable-next-line
                            const appPackage = require(join(dest, 'package.json'))
                            appPackage.name = projectName
                            fs.writeFile(join(dest, 'package.json'), JSON.stringify(appPackage, null, 2), (err) => {
                                if (err) return console.log(err)
                            })
                            process.chdir(customPrjName)
                        } catch (err) {
                            console.log(error(err))
                        }
                    }
                    info(
                        'Install',
                        'We will install dependencies, if you refuse, press ctrl+c to abort, and install dependencies by yourself. :>'
                    )
                    console.log()
                    require('./install')(mirror, done)
                } catch (e) {
                    console.log(error(e))
                }
            })
            .resume()
    }

    function done() {
        console.log()
        console.log()
        console.log()
        success(`Congratulation! "${projectName}" has been created successfully! `)
        console.log()
        console.log(`${chalk.bold.cyan('Kbone')} https://github.com/wechat-miniprogram/kbone`)
    }
}

function template(dest, cwd) {
    return through.obj(function(file, enc, cb) {
        if (!file.stat.isFile()) {
            return cb()
        }

        info('Copy', file.path.replace(cwd + '/', ''))
        this.push(file)
        cb()
    })
}

module.exports = init
