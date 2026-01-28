#!/usr/bin/env node

/**
 * AI Brain Workspace Setup Script
 * Automatically creates .code-workspace files that include AI Brain
 * 
 * Usage:
 *   node setup-workspaces.js <project-path>
 *   node setup-workspaces.js <project1> <project2> <project3>
 *   node setup-workspaces.js --auto (auto-detect projects)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class WorkspaceSetup {
  constructor() {
    this.homeDir = process.env.HOME || require('os').homedir();
    this.aiBrainPath = path.join(this.homeDir, '.ai-brain');
    this.createdWorkspaces = [];
  }

  /**
   * Calculate relative path from project to AI Brain
   */
  calculateRelativePath(projectPath) {
    const projectDir = path.dirname(projectPath);
    const relativePath = path.relative(projectDir, this.aiBrainPath);
    return relativePath;
  }

  /**
   * Get project name from path
   */
  getProjectName(projectPath) {
    return path.basename(path.resolve(projectPath));
  }

  /**
   * Create workspace file content
   */
  createWorkspaceContent(projectPath) {
    const projectName = this.getProjectName(projectPath);
    const relativePath = this.calculateRelativePath(projectPath);

    return {
      folders: [
        {
          path: '.',
          name: projectName
        },
        {
          path: relativePath,
          name: 'AI Brain'
        }
      ],
      settings: {
        'editor.formatOnSave': true,
        'editor.defaultFormatter': 'esbenp.prettier-vscode',
        '[typescript]': {
          'editor.defaultFormatter': 'esbenp.prettier-vscode'
        },
        '[typescriptreact]': {
          'editor.defaultFormatter': 'esbenp.prettier-vscode'
        },
        '[javascript]': {
          'editor.defaultFormatter': 'esbenp.prettier-vscode'
        },
        '[javascriptreact]': {
          'editor.defaultFormatter': 'esbenp.prettier-vscode'
        },
        '[markdown]': {
          'editor.defaultFormatter': 'esbenp.prettier-vscode',
          'editor.wordWrap': 'on'
        },
        'editor.codeActionsOnSave': {
          'source.fixAll.eslint': 'explicit'
        },
        'files.exclude': {
          '**/node_modules': true,
          '**/.DS_Store': true,
          '**/.git': true
        },
        'search.exclude': {
          '**/node_modules': true,
          '**/dist': true,
          '**/coverage': true,
          '**/.git': true
        }
      },
      extensions: {
        recommendations: [
          'esbenp.prettier-vscode',
          'dbaeumer.vscode-eslint',
          'ms-vscode.vscode-typescript-next',
          'ms-vscode-remote.remote-containers',
          'GitHub.copilot'
        ]
      }
    };
  }

  /**
   * Create workspace file for a project
   */
  createWorkspaceFile(projectPath) {
    try {
      const resolvedPath = path.resolve(projectPath);

      // Verify project path exists
      if (!fs.existsSync(resolvedPath)) {
        console.error(`❌ Project path not found: ${resolvedPath}`);
        return false;
      }

      // Check if it's a directory
      const stat = fs.statSync(resolvedPath);
      if (!stat.isDirectory()) {
        console.error(`❌ Not a directory: ${resolvedPath}`);
        return false;
      }

      const projectName = this.getProjectName(resolvedPath);
      const workspaceFile = path.join(
        resolvedPath,
        `${projectName}.code-workspace`
      );

      // Create workspace content
      const content = this.createWorkspaceContent(resolvedPath);

      // Write workspace file
      fs.writeFileSync(workspaceFile, JSON.stringify(content, null, 2));

      console.log(`✅ Created: ${projectName}.code-workspace`);
      console.log(`   Location: ${workspaceFile}`);
      console.log(`   Folders: ${projectName}, AI Brain`);

      this.createdWorkspaces.push({
        name: projectName,
        path: workspaceFile
      });

      return true;
    } catch (error) {
      console.error(`❌ Error creating workspace for ${projectPath}:`, error.message);
      return false;
    }
  }

  /**
   * Auto-detect common project locations
   */
  autoDetectProjects() {
    const commonPaths = [
      path.join(this.homeDir, 'Desktop'),
      path.join(this.homeDir, 'Documents'),
      path.join(this.homeDir, 'Projects'),
      path.join(this.homeDir, 'projects')
    ];

    const projects = [];

    for (const dir of commonPaths) {
      if (fs.existsSync(dir)) {
        const items = fs.readdirSync(dir);

        for (const item of items) {
          const itemPath = path.join(dir, item);
          const stat = fs.statSync(itemPath);

          // Check if it's a project (has package.json or tsconfig.json)
          if (stat.isDirectory()) {
            const hasPackageJson = fs.existsSync(path.join(itemPath, 'package.json'));
            const hasTsConfig = fs.existsSync(path.join(itemPath, 'tsconfig.json'));
            const hasNextConfig = fs.existsSync(path.join(itemPath, 'next.config.ts'));

            if (hasPackageJson || hasTsConfig || hasNextConfig) {
              projects.push(itemPath);
            }
          }
        }
      }
    }

    return projects;
  }

  /**
   * Setup workspaces
   */
  setup(projectPaths = []) {
    console.log('🧠 AI Brain Workspace Setup');
    console.log('═══════════════════════════════════════════\n');

    // Verify AI Brain exists
    if (!fs.existsSync(this.aiBrainPath)) {
      console.error('❌ AI Brain not found at:', this.aiBrainPath);
      process.exit(1);
    }

    console.log('✅ AI Brain found:', this.aiBrainPath);
    console.log('');

    let projects = projectPaths;

    // Auto-detect if no paths provided or --auto flag
    if (projects.length === 0 || projects[0] === '--auto') {
      console.log('🔍 Auto-detecting projects...\n');
      projects = this.autoDetectProjects();

      if (projects.length === 0) {
        console.warn('⚠️  No projects found. Please provide project paths as arguments.');
        console.log('\nUsage:');
        console.log('  node setup-workspaces.js <project-path>');
        console.log('  node setup-workspaces.js <project1> <project2>');
        process.exit(1);
      }

      console.log(`Found ${projects.length} project(s):\n`);
      projects.forEach((p, i) => {
        console.log(`  ${i + 1}. ${this.getProjectName(p)}`);
      });
      console.log('');
    }

    // Create workspace files
    let successCount = 0;
    for (const projectPath of projects) {
      if (this.createWorkspaceFile(projectPath)) {
        successCount++;
      }
    }

    // Summary
    console.log('\n' + '═'.repeat(45));
    console.log(`✅ Setup Complete: ${successCount}/${projects.length} workspace(s) created\n`);

    if (this.createdWorkspaces.length > 0) {
      console.log('📂 Workspace Files Created:');
      this.createdWorkspaces.forEach(ws => {
        console.log(`   • ${ws.name}.code-workspace`);
      });

      console.log('\n📖 How to Use:');
      console.log('   1. Open VS Code');
      console.log('   2. File → Open Workspace from File');
      console.log('   3. Select any .code-workspace file');
      console.log('   4. AI Brain will be available in Explorer sidebar\n');
    }

    return successCount === projects.length;
  }
}

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);
  const setup = new WorkspaceSetup();

  const success = setup.setup(args);
  process.exit(success ? 0 : 1);
}

module.exports = { WorkspaceSetup };
