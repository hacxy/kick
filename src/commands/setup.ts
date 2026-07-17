import { existsSync, mkdirSync } from 'node:fs';
import { readdir, symlink } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import chalk from 'chalk';
import inquirer from 'inquirer';

interface AgentConfig {
  name: string
  skillsDir: string
}

const AGENTS: Record<string, AgentConfig> = {
  'opencode': {
    name: 'OpenCode',
    skillsDir: join(homedir(), '.config', 'opencode', 'skills'),
  },
  'claude-code': {
    name: 'Claude Code',
    skillsDir: join(homedir(), '.claude', 'skills'),
  },
  'hermes': {
    name: 'Hermes',
    skillsDir: join(homedir(), '.hermes', 'skills'),
  },
};

function getSkillsDir(): string {
  // 从 dist/ 向上一级到包根目录
  return resolve(__dirname, '..', 'skills');
}

async function getAvailableSkills(): Promise<string[]> {
  const skillsDir = getSkillsDir();
  if (!existsSync(skillsDir)) {
    return [];
  }
  const entries = await readdir(skillsDir, { withFileTypes: true });
  return entries.filter(e => e.isDirectory()).map(e => e.name);
}

async function installSkills(agent: AgentConfig, skills: string[]): Promise<void> {
  const skillsSourceDir = getSkillsDir();

  if (!existsSync(agent.skillsDir)) {
    mkdirSync(agent.skillsDir, { recursive: true });
  }

  for (const skill of skills) {
    const source = join(skillsSourceDir, skill);
    const target = join(agent.skillsDir, skill);

    if (existsSync(target)) {
      console.log(chalk.yellow(`  跳过 ${skill} (已存在)`));
      continue;
    }

    await symlink(source, target);
    console.log(chalk.green(`  ✓ ${skill}`));
  }
}

export async function setupSkills(): Promise<void> {
  const availableSkills = await getAvailableSkills();

  if (availableSkills.length === 0) {
    console.log(chalk.red('未找到 skills 文件'));
    process.exit(1);
  }

  console.log(chalk.cyan('\n可用 Skills:\n'));
  availableSkills.forEach(s => console.log(chalk.green(`  - ${s}`)));
  console.log();

  const { agent } = await inquirer.prompt([
    {
      type: 'list',
      name: 'agent',
      message: '选择 AI Agent 平台：',
      choices: Object.entries(AGENTS).map(([value, config]) => ({
        name: config.name,
        value,
      })),
    },
  ]);

  const selectedAgent = AGENTS[agent];
  if (!selectedAgent) {
    console.log(chalk.red('无效的选择'));
    process.exit(1);
  }

  console.log(chalk.cyan(`\n安装到 ${selectedAgent.name}...\n`));

  await installSkills(selectedAgent, availableSkills);

  console.log(chalk.green('\n安装完成！'));
  console.log(chalk.gray(`Skills 目录: ${selectedAgent.skillsDir}\n`));
}
