import { cac } from 'cac';
import chalk from 'chalk';
import pkg from '../package.json';
import { createProject } from './commands/new.js';
import { setupSkills } from './commands/setup.js';
import { fetchTemplates } from './services/template.js';

function bootstrap() {
  const cli = cac('kick');

  cli.command('[template] [projectName]', 'Create a new project')
    .option('-t, --template <template>', 'Specify template name')
    .action((template: string | undefined, projectName: string | undefined, options: any) => {
      if (template && !options.template) {
        options.template = template;
      }
      createProject(projectName, options);
    });

  cli.command('new [template] [projectName]', 'Create a new project')
    .option('-t, --template <template>', 'Specify template name')
    .action((template: string | undefined, projectName: string | undefined, options: any) => {
      if (template && !options.template) {
        options.template = template;
      }
      createProject(projectName, options);
    });

  cli.command('list', 'List all available templates')
    .action(async () => {
      try {
        const templates = await fetchTemplates();
        console.log(chalk.cyan(`\nAvailable templates (${templates.length}):\n`));

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
        console.error(chalk.red(`Failed to fetch templates: ${err.message}`));
        process.exit(1);
      }
    });

  cli.command('setup', 'Install skills to AI Agent')
    .action(setupSkills);

  cli.version(pkg.version);
  cli.help();
  cli.parse(process.argv);
}

bootstrap();
