var path = require('path');
var join = path.join;
var basename = path.basename;
var fs = require('fs');
var existsSync = fs.existsSync;
var chalk = require('chalk');
var emptyDir = require('empty-dir');
var info = require('./logger').info;
var error = require('./logger').error;
var success = require('./logger').success;
var isCnFun = require('./utils').isCnFuc;
var checkAppName = require('./utils').checkAppName;
var isSafeToCreateProjectIn = require('./utils').isSafeToCreateProjectIn;
var spawn = require('cross-spawn');

function init(args) {
  var KboneCli = chalk.bold.cyan("Kbone CLI");
  var isCn = isCnFun(args.language);
  var customPrjName = args.project || '';
  var templateName = args.template || '';
  var dest = join(process.cwd(), customPrjName);
  var projectName = basename(dest);
  var mirror = args.mirror;

  isCn = true
  console.log(KboneCli + (!isCn ? ' is booting... ' : ' 正在启动...'));
  console.log(
    KboneCli +
    (!isCn ? ' will execute init command... ' : ' 即将执行 init 命令...')
  );
  checkAppName(projectName);
  if (existsSync(dest) && !emptyDir.sync(dest)) {
    if (!isSafeToCreateProjectIn(dest, projectName)) {
      process.exit(1);
    }
  }

  createApp();

  function createApp() {
    console.log(
      chalk.bold.cyan('Kbone CLI') +
      (!isCn
        ? ' will creating a new kbone app in '
        : ' 即将创建一个新的应用在 ') +
      dest
    );

    const { status, error: cloneError } = spawn.sync('git', ['clone', '--depth=1', templateName !== 'omi' ? `https://github.com/wechat-miniprogram/kbone-template-${templateName}` : `https://github.com/omijs/template-kbone`, customPrjName || '.']);

    // verify git clone succeed
    if (!cloneError && status === 0) {
      try {
        try {
          // remove .git
          const gitPath = join(dest, '.git');
          if (existsSync(gitPath)) {
            spawn.sync('rm', ['-rf', gitPath])
          }
          // change a project name if project.config.json exist
          if (existsSync(join(dest, 'project.config.json'))) {
            var appProjectJson = require(join(dest, 'project.config.json'));
            appProjectJson.projectname = projectName;
            fs.writeFile(join(dest, 'project.config.json'), JSON.stringify(appProjectJson, null, 2), (err) => {
              if (err) return console.log(err);
            });
          }
          // change a package name as a project name if package.json exist
          if (existsSync(join(dest, 'package.json'))) {
            var appPackage = require(join(dest, 'package.json'));
            appPackage.name = projectName;
            fs.writeFile(join(dest, 'package.json'), JSON.stringify(appPackage, null, 2), (err) => {
              if (err) return console.log(err);
            });
            process.chdir(customPrjName || '.');

            // install ndoe package modules
            info(
              '正在安装依赖',
              '你可以使用 ctrl + c 退出，然后自行安装。'
            );
            console.log();
            require('./install')(mirror, done); // npm install
          } else {
            done();
          }
        } catch (e) {
          console.log(error(e));
        }
      } catch (e) {
        console.log(error(e));
      }
    } else {
      // if incorrect template name
      error(`模板 ${templateName} 不存在`);
    }
  }

  function done() {
    console.log();
    console.log();
    console.log();
    
    console.log(`跳转目录`);
    success(`cd ${projectName}`);
    console.log();
    console.log(`开发小程序`);
    success(`npm start`);
    console.log();
    console.log(`开发 Web`);
    success(`npm run web`);
    console.log(`发布 Web`);
    success(`npm run build`);
    console.log();
    console.log();
    success(`恭喜你! "${projectName}"项目初始化成功! `);
    console.log();
    console.log();
  }
}

module.exports = init;
