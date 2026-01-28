#!/usr/bin/env node

/**
 * CodingMaster Web Dashboard
 * 
 * Express.js-based web interface for:
 * - Task delegation
 * - Model selection
 * - Cost monitoring
 * - Performance tracking
 * - Execution history
 */

const express = require('express');
const path = require('path');
const fs = require('fs-extra');

class CodingMasterDashboard {
  constructor(port = 3000, dataDir = null) {
    this.port = port;
    this.dataDir = dataDir || path.join(process.env.HOME, '.ai-brain', '.dashboard-data');
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    
    fs.ensureDirSync(this.dataDir);
  }

  /**
   * Setup Express middleware
   */
  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, 'public')));
    
    // CORS headers
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });
  }

  /**
   * Setup API routes
   */
  setupRoutes() {
    // Health check
    this.app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', version: '2.0.0' });
    });

    // Get dashboard data
    this.app.get('/api/dashboard', (req, res) => {
      res.json({
        title: 'CodingMaster Dashboard',
        version: '2.0.0',
        features: [
          'Task Delegation',
          'Model Selection',
          'Cost Monitoring',
          'Performance Tracking',
          'Execution History'
        ]
      });
    });

    // Get available models
    this.app.get('/api/models', (req, res) => {
      const models = [
        { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', platform: 'openai', cost: 0.01 },
        { id: 'gpt-4o', name: 'GPT-4o', platform: 'openai', cost: 0.005 },
        { id: 'claude-3-opus', name: 'Claude 3 Opus', platform: 'anthropic', cost: 0.015 },
        { id: 'gemini-pro', name: 'Gemini Pro', platform: 'google', cost: 0.0005 }
      ];
      res.json(models);
    });

    // Get domains
    this.app.get('/api/domains', (req, res) => {
      const domains = [
        { id: 'frontend', name: 'Frontend Development' },
        { id: 'backend', name: 'Backend Development' },
        { id: 'dataScience', name: 'Data Science & ML' },
        { id: 'devops', name: 'DevOps & Infrastructure' },
        { id: 'mobile', name: 'Mobile Development' },
        { id: 'testing', name: 'Testing & QA' }
      ];
      res.json(domains);
    });

    // Delegate task
    this.app.post('/api/tasks', (req, res) => {
      const { task, domain, model, strategy } = req.body;
      
      const taskId = require('crypto').randomUUID();
      const taskData = {
        id: taskId,
        task: task,
        domain: domain,
        model: model,
        strategy: strategy || 'hybrid',
        status: 'queued',
        createdAt: new Date().toISOString()
      };

      // Save task
      const taskPath = path.join(this.dataDir, `${taskId}.json`);
      fs.writeFileSync(taskPath, JSON.stringify(taskData, null, 2));

      res.json({
        success: true,
        taskId: taskId,
        message: 'Task queued successfully'
      });
    });

    // Get task status
    this.app.get('/api/tasks/:taskId', (req, res) => {
      const taskPath = path.join(this.dataDir, `${req.params.taskId}.json`);
      
      if (fs.existsSync(taskPath)) {
        const taskData = JSON.parse(fs.readFileSync(taskPath, 'utf-8'));
        res.json(taskData);
      } else {
        res.status(404).json({ error: 'Task not found' });
      }
    });

    // Get all tasks
    this.app.get('/api/tasks', (req, res) => {
      const tasks = [];
      const files = fs.readdirSync(this.dataDir);
      
      files.forEach(file => {
        if (file.endsWith('.json')) {
          const taskData = JSON.parse(fs.readFileSync(path.join(this.dataDir, file), 'utf-8'));
          tasks.push(taskData);
        }
      });

      res.json(tasks);
    });

    // Get statistics
    this.app.get('/api/stats', (req, res) => {
      const tasks = [];
      const files = fs.readdirSync(this.dataDir);
      
      files.forEach(file => {
        if (file.endsWith('.json')) {
          const taskData = JSON.parse(fs.readFileSync(path.join(this.dataDir, file), 'utf-8'));
          tasks.push(taskData);
        }
      });

      const stats = {
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.status === 'completed').length,
        failedTasks: tasks.filter(t => t.status === 'failed').length,
        queuedTasks: tasks.filter(t => t.status === 'queued').length,
        processingTasks: tasks.filter(t => t.status === 'processing').length
      };

      res.json(stats);
    });

    // Serve dashboard HTML
    this.app.get('/', (req, res) => {
      res.send(this.getHTML());
    });
  }

  /**
   * Get dashboard HTML
   */
  getHTML() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CodingMaster Dashboard</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    header {
      background: white;
      padding: 30px;
      border-radius: 10px;
      margin-bottom: 30px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }

    h1 {
      color: #333;
      margin-bottom: 10px;
    }

    .version {
      color: #666;
      font-size: 14px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .card {
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }

    .card h2 {
      color: #333;
      margin-bottom: 15px;
      font-size: 18px;
    }

    .form-group {
      margin-bottom: 15px;
    }

    label {
      display: block;
      color: #666;
      font-size: 14px;
      margin-bottom: 5px;
      font-weight: 500;
    }

    input, select, textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 14px;
      font-family: inherit;
    }

    textarea {
      resize: vertical;
      min-height: 100px;
    }

    button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: transform 0.2s;
    }

    button:hover {
      transform: translateY(-2px);
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
    }

    .stat {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 10px;
      text-align: center;
    }

    .stat-value {
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .stat-label {
      font-size: 12px;
      opacity: 0.9;
    }

    .task-list {
      background: white;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }

    .task-item {
      padding: 15px;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .task-item:last-child {
      border-bottom: none;
    }

    .task-info {
      flex: 1;
    }

    .task-title {
      color: #333;
      font-weight: 500;
      margin-bottom: 5px;
    }

    .task-meta {
      color: #999;
      font-size: 12px;
    }

    .status {
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    .status.completed {
      background: #d4edda;
      color: #155724;
    }

    .status.processing {
      background: #fff3cd;
      color: #856404;
    }

    .status.queued {
      background: #d1ecf1;
      color: #0c5460;
    }

    .status.failed {
      background: #f8d7da;
      color: #721c24;
    }

    .footer {
      text-align: center;
      color: white;
      margin-top: 30px;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>🚀 CodingMaster Dashboard</h1>
      <p class="version">Version 2.0.0 - Advanced Task Delegation & Monitoring</p>
    </header>

    <div class="grid">
      <div class="card">
        <h2>📝 Delegate Task</h2>
        <form id="taskForm">
          <div class="form-group">
            <label>Task Description</label>
            <textarea id="taskInput" placeholder="Describe your task..." required></textarea>
          </div>
          <div class="form-group">
            <label>Domain</label>
            <select id="domainSelect" required>
              <option value="">Select a domain...</option>
              <option value="frontend">Frontend Development</option>
              <option value="backend">Backend Development</option>
              <option value="dataScience">Data Science & ML</option>
              <option value="devops">DevOps & Infrastructure</option>
              <option value="mobile">Mobile Development</option>
              <option value="testing">Testing & QA</option>
            </select>
          </div>
          <div class="form-group">
            <label>Model</label>
            <select id="modelSelect" required>
              <option value="">Select a model...</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
              <option value="gpt-4o">GPT-4o</option>
              <option value="claude-3-opus">Claude 3 Opus</option>
              <option value="gemini-pro">Gemini Pro</option>
            </select>
          </div>
          <button type="submit">Delegate Task</button>
        </form>
      </div>

      <div class="card">
        <h2>📊 Statistics</h2>
        <div class="stats" id="statsContainer">
          <div class="stat">
            <div class="stat-value">-</div>
            <div class="stat-label">Total Tasks</div>
          </div>
          <div class="stat">
            <div class="stat-value">-</div>
            <div class="stat-label">Completed</div>
          </div>
          <div class="stat">
            <div class="stat-value">-</div>
            <div class="stat-label">Processing</div>
          </div>
          <div class="stat">
            <div class="stat-value">-</div>
            <div class="stat-label">Failed</div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <h2>📋 Recent Tasks</h2>
      <div class="task-list" id="taskList">
        <div class="task-item">
          <div class="task-info">
            <div class="task-title">No tasks yet</div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <p>CodingMaster v2.0.0 | Advanced AI Task Delegation System</p>
    </div>
  </div>

  <script>
    // Load statistics
    async function loadStats() {
      try {
        const response = await fetch('/api/stats');
        const stats = await response.json();
        
        const statElements = document.querySelectorAll('.stat-value');
        statElements[0].textContent = stats.totalTasks;
        statElements[1].textContent = stats.completedTasks;
        statElements[2].textContent = stats.processingTasks;
        statElements[3].textContent = stats.failedTasks;
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    }

    // Load tasks
    async function loadTasks() {
      try {
        const response = await fetch('/api/tasks');
        const tasks = await response.json();
        
        const taskList = document.getElementById('taskList');
        
        if (tasks.length === 0) {
          taskList.innerHTML = '<div class="task-item"><div class="task-info"><div class="task-title">No tasks yet</div></div></div>';
          return;
        }

        taskList.innerHTML = tasks.map(task => \`
          <div class="task-item">
            <div class="task-info">
              <div class="task-title">\${task.task.substring(0, 50)}...</div>
              <div class="task-meta">Domain: \${task.domain} | Model: \${task.model}</div>
            </div>
            <div class="status \${task.status}">\${task.status}</div>
          </div>
        \`).join('');
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    }

    // Handle form submission
    document.getElementById('taskForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const task = document.getElementById('taskInput').value;
      const domain = document.getElementById('domainSelect').value;
      const model = document.getElementById('modelSelect').value;

      try {
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task, domain, model })
        });

        if (response.ok) {
          document.getElementById('taskForm').reset();
          loadTasks();
          loadStats();
          alert('Task delegated successfully!');
        }
      } catch (error) {
        console.error('Error delegating task:', error);
        alert('Error delegating task');
      }
    });

    // Load data on page load
    loadStats();
    loadTasks();

    // Refresh every 5 seconds
    setInterval(() => {
      loadStats();
      loadTasks();
    }, 5000);
  </script>
</body>
</html>
    `;
  }

  /**
   * Start the dashboard server
   */
  start() {
    this.app.listen(this.port, () => {
      console.log(`\n🚀 CodingMaster Dashboard running at http://localhost:${this.port}\n`);
    });
  }
}

module.exports = CodingMasterDashboard;

// CLI usage
if (require.main === module) {
  const dashboard = new CodingMasterDashboard(3000);
  dashboard.start();
}
