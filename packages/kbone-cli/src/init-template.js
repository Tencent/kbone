const path = require('path')

const join = path.join
const basename = path.basename
const fs = require('fs')
const spawn = require('cross-spawn')

const existsSync = fs.existsSync
const chalk = require('chalk')
const emptyDir = require('empty-dir')
const info = require('./logger').info
const error = require('./logger').error
const success = require('./logger').success
const isCnFun = require('./utils').isCnFuc
const checkAppName = require('./utils').checkAppName
const isSafeToCreateProjectIn = require('./utils').isSafeToCreateProjectIn


function init(args) {
    const KboneCli = chalk.bold.cyan('Kbone CLI')
    let isCn = isCnFun(args.language)
    const customPrjName = args.project || ''
    const templateName = args.template || ''
    const dest = join(process.cwd(), customPrjName)
    const projectName = basename(dest)
    const mirror = args.mirror

    isCn = true
    console.log(KboneCli + (!isCn ? ' is booting... ' : ' 正在启动...'))
    console.log(
        KboneCli +
    (!isCn ? ' will execute init command... ' : ' 即将执行 init 命令...')
    )
    checkAppName(projectName)
    if (existsSync(dest) && !emptyDir.sync(dest)) {
        if (!isSafeToCreateProjectIn(dest, projectName)) {
            process.exit(1)
        }
    }

    createApp()

    function createApp() {
        console.log(
            chalk.bold.cyan('Kbone CLI') +
      (!isCn
          ? ' will creating a new kbone app in '
          : ' 即将创建一个新的应用在 ') +
      dest
        )

        const {status, error: cloneError} = spawn.sync('git', ['clone', '--depth=1', templateName !== 'omi' ? `https://github.com/wechat-miniprogram/kbone-template-${templateName}` : 'https://github.com/omijs/template-kbone', customPrjName || '.'])

        // verify git clone succeed
        if (!cloneError && status === 0) {
            try {
                try {
                    // remove .git
                    const gitPath = join(dest, '.git')
                    if (existsSync(gitPath)) {
                        spawn.sync('rm', ['-rf', gitPath])
                    }
                    // change a project name if project.config.json exist
                    if (existsSync(join(dest, 'project.config.json'))) {
                        // eslint-disable-next-line
                        const appProjectJson = require(join(dest, 'project.config.json'))
                        appProjectJson.projectname = projectName
                        fs.writeFile(join(dest, 'project.config.json'), JSON.stringify(appProjectJson, null, 2), (err) => {
                            if (err) return console.log(err)
                        })
                    }
                    // change a package name as a project name if package.json exist
                    if (existsSync(join(dest, 'package.json'))) {
                        // eslint-disable-next-line
                        const appPackage = require(join(dest, 'package.json'))
                        appPackage.name = projectName
                        fs.writeFile(join(dest, 'package.json'), JSON.stringify(appPackage, null, 2), (err) => {
                            if (err) return console.log(err)
                        })
                        process.chdir(customPrjName || '.')

                        // install node package modules
                        info(
                            '正在安装依赖',
                            '你可以使用 ctrl + c 退出，然后自行安装。'
                        )
                        console.log()
                        require('./install')(mirror, done) // npm install
                    } else {
                        done()
                    }
                } catch (e) {
                    console.log(error(e))
                }
            } catch (e) {
                console.log(error(e))
            }
        } else {
            // if incorrect template name
            error(`模板 ${templateName} 不存在`)
        }
    }

    function done() {
        console.log()
        console.log()
        console.log()

        console.log('跳转目录')
        success(`cd ${projectName}`)
        console.log()
        console.log('开发小程序')
        success('npm run mp')
        console.log()
        console.log('开发 Web')
        success('npm run web')
        console.log('发布 Web')
        success('npm run build')
        console.log()
        console.log()
        success(`恭喜你! "${projectName}"项目初始化成功! `)
        console.log()
        console.log()
    }
}

module.exports = init
