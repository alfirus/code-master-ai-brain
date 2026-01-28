const vscode = require('vscode');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

let extensionContext;

/**
 * Activate the extension
 */
function activate(context) {
  extensionContext = context;

  console.log('CodingMaster extension activated');

  // Register commands
  const delegateTaskCommand = vscode.commands.registerCommand('codingmaster.delegateTask', delegateTask);
  const showDashboardCommand = vscode.commands.registerCommand('codingmaster.showDashboard', showDashboard);
  const selectModelCommand = vscode.commands.registerCommand('codingmaster.selectModel', selectModel);
  const viewHistoryCommand = vscode.commands.registerCommand('codingmaster.viewHistory', viewHistory);

  context.subscriptions.push(delegateTaskCommand);
  context.subscriptions.push(showDashboardCommand);
  context.subscriptions.push(selectModelCommand);
  context.subscriptions.push(viewHistoryCommand);

  // Show welcome message
  vscode.window.showInformationMessage('CodingMaster v2.0.0 activated! Use Ctrl+Shift+D to delegate tasks.');
}

/**
 * Delegate a task
 */
async function delegateTask() {
  const editor = vscode.window.activeTextEditor;
  
  if (!editor) {
    vscode.window.showErrorMessage('No active editor');
    return;
  }

  // Get selected text or ask for task
  let task = editor.document.getText(editor.selection);
  
  if (!task) {
    task = await vscode.window.showInputBox({
      prompt: 'Enter your task description',
      placeHolder: 'e.g., Write a function to calculate fibonacci numbers'
    });
  }

  if (!task) {
    return;
  }

  // Show progress
  await vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: 'CodingMaster',
    cancellable: false
  }, async (progress) => {
    progress.report({ message: 'Delegating task...' });

    try {
      const config = vscode.workspace.getConfiguration('codingmaster');
      const model = config.get('defaultModel', 'gpt-4o');

      // Call CodingMaster API
      const response = await axios.post('http://localhost:3000/api/tasks', {
        task: task,
        model: model,
        strategy: 'best-match'
      });

      if (response.data.success) {
        vscode.window.showInformationMessage(`Task delegated! ID: ${response.data.taskId}`);
        
        // Save to history
        if (config.get('autoSaveResults', true)) {
          saveToHistory(task, response.data.taskId, model);
        }
      }
    } catch (error) {
      vscode.window.showErrorMessage(`Error: ${error.message}`);
    }
  });
}

/**
 * Show dashboard
 */
async function showDashboard() {
  const panel = vscode.window.createWebviewPanel(
    'codingmaster-dashboard',
    'CodingMaster Dashboard',
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true
    }
  );

  panel.webview.html = getDashboardHTML();
}

/**
 * Select model
 */
async function selectModel() {
  const models = [
    { label: 'GPT-4 Turbo', value: 'gpt-4-turbo' },
    { label: 'GPT-4o', value: 'gpt-4o' },
    { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
    { label: 'Claude 3 Opus', value: 'claude-3-opus' },
    { label: 'Gemini Pro', value: 'gemini-pro' }
  ];

  const selected = await vscode.window.showQuickPick(models, {
    placeHolder: 'Select preferred model'
  });

  if (selected) {
    const config = vscode.workspace.getConfiguration('codingmaster');
    await config.update('defaultModel', selected.value, vscode.ConfigurationTarget.Global);
    vscode.window.showInformationMessage(`Default model set to ${selected.label}`);
  }
}

/**
 * View history
 */
async function viewHistory() {
  const historyDir = path.join(process.env.HOME, '.ai-brain', '.task-results');
  
  if (!fs.existsSync(historyDir)) {
    vscode.window.showInformationMessage('No task history yet');
    return;
  }

  const files = fs.readdirSync(historyDir).filter(f => f.endsWith('.json'));
  
  if (files.length === 0) {
    vscode.window.showInformationMessage('No task history yet');
    return;
  }

  const items = files.map(file => ({
    label: file.replace('.json', ''),
    description: 'Task result'
  }));

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: 'Select a task to view'
  });

  if (selected) {
    const resultPath = path.join(historyDir, `${selected.label}.json`);
    const result = JSON.parse(fs.readFileSync(resultPath, 'utf-8'));
    
    const panel = vscode.window.createWebviewPanel(
      'codingmaster-result',
      `Task: ${selected.label}`,
      vscode.ViewColumn.Two,
      {}
    );

    panel.webview.html = `
      <html>
        <head>
          <style>
            body { font-family: monospace; padding: 20px; background: #f5f5f5; }
            pre { background: white; padding: 15px; border-radius: 5px; overflow-x: auto; }
          </style>
        </head>
        <body>
          <h2>Task Result</h2>
          <pre>${JSON.stringify(result, null, 2)}</pre>
        </body>
      </html>
    `;
  }
}

/**
 * Save task to history
 */
function saveToHistory(task, taskId, model) {
  const historyDir = path.join(process.env.HOME, '.ai-brain', '.vscode-history');
  
  if (!fs.existsSync(historyDir)) {
    fs.mkdirSync(historyDir, { recursive: true });
  }

  const historyFile = path.join(historyDir, 'history.json');
  let history = [];

  if (fs.existsSync(historyFile)) {
    history = JSON.parse(fs.readFileSync(historyFile, 'utf-8'));
  }

  history.push({
    taskId: taskId,
    task: task,
    model: model,
    timestamp: new Date().toISOString()
  });

  fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
}

/**
 * Get dashboard HTML
 */
function getDashboardHTML() {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 20px;
            background: #f5f5f5;
          }
          h1 { color: #333; }
          .card {
            background: white;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 15px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }
          button {
            background: #667eea;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
          button:hover { background: #764ba2; }
        </style>
      </head>
      <body>
        <h1>🚀 CodingMaster Dashboard</h1>
        <div class="card">
          <h2>Quick Actions</h2>
          <button onclick="vscode.postMessage({command: 'delegateTask'})">Delegate Task</button>
          <button onclick="vscode.postMessage({command: 'selectModel'})">Select Model</button>
          <button onclick="vscode.postMessage({command: 'viewHistory'})">View History</button>
        </div>
        <div class="card">
          <h2>Features</h2>
          <ul>
            <li>Delegate tasks to multiple AI models</li>
            <li>Select preferred model</li>
            <li>View task history</li>
            <li>Auto-save results</li>
            <li>Keyboard shortcut: Ctrl+Shift+D</li>
          </ul>
        </div>
      </body>
    </html>
  `;
}

/**
 * Deactivate the extension
 */
function deactivate() {
  console.log('CodingMaster extension deactivated');
}

module.exports = {
  activate,
  deactivate
};
