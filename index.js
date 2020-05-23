var mysql = require("mysql");
var inquirer = require("inquirer");
require("dotenv").config();
var consoletable = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: process.env.MYSQL_PASSWORD,
  database: "company_db"
});

connection.connect(function(err) {
  if (err) throw err;
  init();
});

function init() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View all employees",
        "View all departments",
        "View all company roles",
        "Add a new employee",
        "Add a new role",
        "Add a new department",
        "Update employee role",
        "Exit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "View all employees":
        displayAll();
        break;

      case "View all departments":
        departmentView();
        break;

      case "View all company roles":
        roleView();
        break;

      case "Add a new employee":
        addEmployee();
        break;

      case "Add a new role":
        addRole();
        break;
      
      case "Add a new department":
        addDepartment();
        break;
      
      case "Update employee role":
        updateRole();
        break;
      
      case "Exit":
        exitMenu();
        break;
      }
    });
}

function displayAll() {
  console.log("\n");
  connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id=role.id LEFT JOIN department ON role.department_id=department.id LEFT JOIN employee manager on manager.id = employee.manager_id;", function(err, res) {
    if (err) throw err;
    console.table(res);
    init();
  });
}

function departmentView() {
  console.log("\n");
  connection.query("SELECT * FROM department", function(err, res) {
    if (err) throw err;
    console.table(res);
    init();
  });
}

function roleView() {
  console.log("\n");
  connection.query("SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id=department.id", function(err, res) {
    if (err) throw err;
    console.table(res);
    init();
  });
}

function addEmployee() {

  connection.query("SELECT title, id FROM role", function (err, res) {
    if (err) throw err;
  
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "What is the employee's first name?"
      },
      {
        name: "last_name",
        type: "input",
        message: "What the employee's last name?"
      },
      {
        name: "roleChoice",
        type: "list",
        message: "What is the employee's role?",
        choices: res.map(role => {
        return {
          name: role.title, 
          value: role.id
        }
       })
      },
      {
        name: "managerChoice",
        type: "input",
        // type: "rawlist",
        // choices: function() {
          // var choiceArray = [];
          // for (var i = 0; i < res.length; i++) {
          //   choiceArray.push(res[i].
        message: "What is the employee's manager ID?"
      }
    ]).then(function(answer) {
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: answer.roleChoice,
          manager_id: answer.managerChoice 
        },
        function(err) {
          if (err) throw err;
          console.log("\n");
          console.log("The new employee is now in the database.");
          console.log("\n");
          init();
        }
      );
    })
  });
}

function addRole() {
  connection.query("SELECT name, id FROM department", function(err, res) {
    if (err) throw err;

  inquirer
  .prompt([
    {
      name: "newRole",
      type: "input",
      message: "What role would you like to add?"
    },
    {
      name: "newSalary",
      type: "input",
      message: "What is the salary for this role?"
    },
    {
      name: "departmentChoice",
      type: "list",
      message: "In which department does this role belong?",
      choices: res.map(department => {
        return {
          name: department.name, 
          value: department.id
        }
      })
    }
  ])
  .then(function(answer) {
    connection.query(
      "INSERT INTO role SET ?",
      {
        title: answer.newRole,
        salary: answer.newSalary,
        department_id: answer.departmentChoice 
      },
      function(err) {
        if (err) throw err;
        console.log("\n");
        console.log("The new role is now in the database.");
        console.log("\n");
        init();
      }
    );
  });
 })
}

function addDepartment() {
  inquirer
  .prompt([
    {
      name: "newDept",
      type: "input",
      message: "What department would you like to add?"
    }
  ])
  .then(function(answer) {
    connection.query(
      "INSERT INTO department SET ?",
      {
        name: answer.newDept 
      },
      function(err) {
        if (err) throw err;
        console.log("\n");
        console.log("The new department is now in the database.");
        console.log("\n");
        init();
      }
    );
  });
}

function updateRole() {
  inquirer
  .prompt([
    {
      name: "employeeName",
      type: "input",
      message: "What is the last name of the employee whose role you would like to update?"
    },
    {
      name: "newRole",
      type: "number",
      message: "What role ID would you like to assign to this employee?"
    }
  ]).then(function(answer) {
    connection.query("UPDATE employee SET role_id = ? WHERE last_name = ?", [answer.newRole, answer.employeeName],
    function(err) {
      if (err) throw err;
      console.log("The employee's role has been updated.");
      init();
    })
  })
}

function exitMenu() {
  console.log("Goodbye");
  connection.end();
}


