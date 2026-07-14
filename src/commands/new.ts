import type { Template } from '../services/template.js';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { clearTemplateCache, copyFromCache, hasCache, saveToCache } from '../services/cache.js';
import { downloadTemplate } from '../services/download.js';
import { fetchTemplates } from '../services/template.js';
import { emptyDir, getVisibleProjectName, isDirEmpty, renameInDir, resolveProjectPath, updatePackageName } from '../utils.js';

interface NewOptions {
  template?: string
  refresh?: boolean
}

async function selectTemplate(templates: Template[]): Promise<Template> {
  const categories = [...new Set(templates.map(t => t.category))];

  const { category } = await inquirer.prompt([
    {
      type: 'list',
      name: 'category',
      message: '请选择项目类型：',
      choices: categories,
    },
  ]);

  const filtered = templates.filter(t => t.category === category);

  const { template } = await inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: '请选择模板：',
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
      console.error(chalk.red(`模板 "${options.template}" 不存在`));
      console.log(chalk.gray('可用模板：'));
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
      message: '请输入项目名称：',
      validate: (input: string) => {
        if (!input) return '项目名称不能为空';
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
        message: `${dest} 已存在且非空，是否清空后继续？`,
        default: false,
      },
    ]);

    if (!shouldClear) {
      console.log(chalk.yellow('操作已取消'));
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

async function setupTemplate(template: Template, dest: string, refresh: boolean): Promise<void> {
  // Try cache first
  if (!refresh && hasCache(template.name)) {
    const spinner = ora('从缓存复制模板...').start();
    try {
      await copyFromCache(template.name, dest);
      spinner.succeed('模板复制完成');
      return;
    }
    catch {
      spinner.warn('缓存复制失败，重新下载');
      await clearTemplateCache(template.name);
    }
  }

  // Download from remote
  const spinner = ora(`正在下载模板 ${chalk.cyan(template.name)}...`).start();
  try {
    await downloadTemplate(template.repo, dest);
    spinner.succeed('模板下载完成');

    // Save to cache
    await saveToCache(template.name, dest);
  }
  catch (err: any) {
    spinner.fail(`模板下载失败: ${err.message}`);
    process.exit(1);
  }
}

async function renameSpecialFiles(dest: string): Promise<void> {
  await renameInDir(dest, '_gitignore', '.gitignore');
  await renameInDir(dest, '_vscode', '.vscode');
  await renameInDir(dest, '_github', '.github');
}

export async function createProject(projectName: string | undefined, options: NewOptions): Promise<void> {
  const spinner = ora('正在获取模板列表...').start();

  let templates: Template[];
  try {
    templates = await fetchTemplates();
    spinner.succeed(`找到 ${templates.length} 个模板`);
  }
  catch (err: any) {
    spinner.fail(`获取模板列表失败: ${err.message}`);
    process.exit(1);
  }

  const template = await resolveTemplate(options, templates);
  const name = await resolveProjectName(projectName);
  const visibleName = getVisibleProjectName(name);
  const dest = resolveProjectPath(name);

  await ensureDestEmpty(dest, name);
  await setupTemplate(template, dest, options.refresh || false);
  await renameSpecialFiles(dest);
  await updatePackageName(dest, visibleName);

  console.log();
  console.log(chalk.green(`项目 ${chalk.bold(visibleName)} 创建成功！`));
  console.log();
  console.log(chalk.cyan(`  cd ${name}`));
  console.log(chalk.cyan('  pnpm install'));
  console.log(chalk.cyan('  pnpm dev'));
  console.log();
}
