import type { Template } from '../services/template.js';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { downloadTemplate } from '../services/download.js';
import { fetchTemplates } from '../services/template.js';
import { emptyDir, getVisibleProjectName, isDirEmpty, renameInDir, resolveProjectPath, updatePackageName } from '../utils.js';

interface NewOptions {
  template?: string
}

async function selectTemplate(templates: Template[]): Promise<Template> {
  const categories = [...new Set(templates.map(t => t.category))];

  const { category } = await inquirer.prompt([
    {
      type: 'list',
      name: 'category',
      message: 'Select project type:',
      choices: categories,
    },
  ]);

  const filtered = templates.filter(t => t.category === category);

  const { template } = await inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: 'Select template:',
      choices: filtered.map(t => ({
        name: `${t.name.padEnd(20)} ${chalk.gray(t.description)}`,
        value: t,
      })),
    },
  ]);

  return template;
}

async function resolveTemplate(options: NewOptions, templates: Template[]): Promise<Template> {
  if (options.template) {
    const found = templates.find(t => t.name === options.template);
    if (!found) {
      console.error(chalk.red(`Template "${options.template}" not found`));
      console.log(chalk.gray('Available templates:'));
      templates.forEach(t => console.log(chalk.gray(`  - ${t.name}`)));
      process.exit(1);
      // Unreachable code, but TypeScript needs it
      return templates[0] as Template;
    }
    return found;
  }

  return selectTemplate(templates);
}

async function resolveProjectName(argName?: string): Promise<string> {
  if (argName) return argName;

  const { projectName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Enter project name:',
      validate: (input: string) => {
        if (!input) return 'Project name cannot be empty';
        return true;
      },
    },
  ]);

  return projectName;
}

async function ensureDestEmpty(dest: string, projectName: string): Promise<void> {
  if (!existsSync(dest)) return;

  if (!(await isDirEmpty(dest))) {
    const { shouldClear } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'shouldClear',
        message: `${dest} already exists and is not empty, clear and continue?`,
        default: false,
      },
    ]);

    if (!shouldClear) {
      console.log(chalk.yellow('Operation cancelled'));
      process.exit(0);
    }

    if (projectName === '.' || projectName === './') {
      await emptyDir(resolve(dest));
    }
    else {
      const { rm } = await import('node:fs/promises');
      await rm(dest, { recursive: true, force: true });
    }
  }
}

async function setupTemplate(template: Template, dest: string): Promise<void> {
  const spinner = ora(`Downloading template ${chalk.cyan(template.name)}...`).start();
  try {
    await downloadTemplate(template.repo, dest);
    spinner.succeed('Template downloaded successfully');
  }
  catch (err: any) {
    spinner.fail(`Template download failed: ${err.message}`);
    process.exit(1);
  }
}

async function renameSpecialFiles(dest: string): Promise<void> {
  await renameInDir(dest, '_gitignore', '.gitignore');
  await renameInDir(dest, '_vscode', '.vscode');
  await renameInDir(dest, '_github', '.github');
}

export async function createProject(projectName: string | undefined, options: NewOptions): Promise<void> {
  const spinner = ora('Fetching template list...').start();

  let templates: Template[];
  try {
    templates = await fetchTemplates();
    spinner.succeed(`Found ${templates.length} templates`);
  }
  catch (err: any) {
    spinner.fail(`Failed to fetch templates: ${err.message}`);
    process.exit(1);
  }

  const template = await resolveTemplate(options, templates);
  const name = await resolveProjectName(projectName);
  const visibleName = getVisibleProjectName(name);
  const dest = resolveProjectPath(name);

  await ensureDestEmpty(dest, name);
  await setupTemplate(template, dest);
  await renameSpecialFiles(dest);
  await updatePackageName(dest, visibleName);

  console.log();
  console.log(chalk.green(`Project ${chalk.bold(visibleName)} created successfully!`));
  console.log();
  console.log(chalk.cyan(`  cd ${name}`));
  console.log(chalk.cyan('  npm install'));
  console.log(chalk.cyan('  npm dev'));
  console.log();
}
