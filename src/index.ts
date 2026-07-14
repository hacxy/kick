import { cac } from 'cac';
import pkg from '../package.json';
import { createProject } from './commands/new.js';

function bootstrap() {
  const cli = cac('kick');

  cli.command('[template] [projectName]', '创建新项目')
    .option('-t, --template <template>', '指定模板名称')
    .option('--refresh', '强制刷新缓存')
    .action((template: string | undefined, projectName: string | undefined, options: any) => {
      if (template && !options.template) {
        options.template = template;
      }
      createProject(projectName, options);
    });

  cli.version(pkg.version);
  cli.help();
  cli.parse(process.argv);
}

bootstrap();
