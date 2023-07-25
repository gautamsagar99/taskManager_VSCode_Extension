const vscode = require("vscode");

let tasks = [];

class TaskItem extends vscode.TreeItem {
  constructor(label, collapsibleState) {
    super(label, collapsibleState);
  }
}

class TaskProvider {
  constructor() {
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
  }

  getTreeItem(element) {
    return element;
  }

  getChildren() {
    return Promise.resolve(
      tasks.map(
        (task, index) =>
          new TaskItem(
            `${index + 1}. ${task}`,
            vscode.TreeItemCollapsibleState.None
          )
      )
    );
  }

  refresh() {
    this._onDidChangeTreeData.fire();
  }
}

function activate(context) {
  console.log('Congratulations, your extension "taskmanager" is now active!');

  const taskProvider = new TaskProvider();
  vscode.window.registerTreeDataProvider("taskView", taskProvider);

  let addTaskDisposable = vscode.commands.registerCommand(
    "extension.addTask",
    addTask
  );

  let removeTaskDisposable = vscode.commands.registerCommand(
    "extension.removeTask",
    removeTask
  );

  context.subscriptions.push(addTaskDisposable, removeTaskDisposable);

  function addTask() {
    vscode.window.showInputBox({ prompt: "Enter a new task" }).then((task) => {
      if (task) {
        tasks.push(task);
        taskProvider.refresh();
      }
    });
  }

  function removeTask() {
    vscode.window
      .showInputBox({ prompt: "Enter the index of the task to remove" })
      .then((indexStr) => {
        const index = parseInt(indexStr);
        if (isNaN(index) || index < 1 || index > tasks.length) {
          vscode.window.showErrorMessage("Invalid index");
          return;
        }

        const removedTask = tasks.splice(index - 1, 1);
        vscode.window.showInformationMessage(
          `Task '${removedTask[0]}' removed successfully.`
        );
        taskProvider.refresh();
      });
  }
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
