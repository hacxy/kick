import { cac } from 'cac';
import chalk from 'chalk';
import pkg from '../package.json';
import { createProject } from './commands/new.js';
import { fetchTemplates } from './services/template.js';

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

  cli.command('new [template] [projectName]', '创建新项目')
    .option('-t, --template <template>', '指定模板名称')
    .option('--refresh', '强制刷新缓存')
    .action((template: string | undefined, projectName: string | undefined, options: any) => {
      if (template && !options.template) {
        options.template = template;
      }
      createProject(projectName, options);
    });

  cli.command('list', '列出所有可用模板')
    .action(async () => {
      try {
        const templates = await fetchTemplates();
        console.log(chalk.cyan(`\n可用模板 (${templates.length}):\n`));

        const categories = [...new Set(templates.map(t => t.category))];

        for (const category of categories) {
          console.log(chalk.yellow(`${category}:`));
          const categoryTemplates = templates.filter(t => t.category === category);
          for (const template of categoryTemplates) {
            console.log(`  ${chalk.green(template.name.padEnd(20))} ${chalk.gray(template.description)}`);
          }
          console.log();
        }
      }
      catch (err: any) {
        console.error(chalk.red(`获取模板列表失败: ${err.message}`));
        process.exit(1);
      }
    });

  cli.version(pkg.version);
  cli.help();
  cli.parse(process.argv);
}

bootstrap();
