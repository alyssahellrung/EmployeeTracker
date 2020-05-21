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
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "View all employees",
        "View all departments",
        "View all company roles",
        "Add a new employee",
        "Add a new role",
        "Add a new department",
        "Update employee role"
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
      }
    });
}

function displayAll() {
  console.log("\n");
  connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name, employee.manager_id FROM employee INNER JOIN role ON employee.role_id=role.id INNER JOIN department ON role.department_id=department.id;", function(err, res) {
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
  connection.query("SELECT title, salary FROM role", function(err, res) {
    if (err) throw err;
    console.table(res);
    init();
  });
}

function addEmployee() {
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
        name: "role",
        type: "rawlist",
        message: "What is the employee's role?",
        choices:[]
      },
      {
        name: "managerName",
        type: "rawlist",
        message: "Who is the employee's manager?",
        choices:[]
      }
    ])
    .then(function(answer) {
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          manager_id: answer.managerName
        },
        "INSERT INTO role SET ?",
        {
          role_id: answer.role
        },
        function(err) {
          if (err) throw err;
          console.log("Your employee's information is now in the database.");
          init();
        }
      );
    });
}

function addRole() {
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
      type: "rawlist",
      message: "In which department does this role belong?",
      choices: function() {
        var choiceArray = [];
        
        return choiceArray;
      }
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
        console.log("The new role is now in the database.");
        init();
      }
    );
  });
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
        console.log("The new department is now in the database.");
        init();
      }
    );
  });
}

// function updateRole {
//   inquirer
//   .prompt
// }