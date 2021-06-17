const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const colors = require('colors');

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Enter your username:
  user: 'root',

  // Enter your password:
  password: 'unicorn',
  database: 'employee_trackerDB',
});

function start(){
    inquirer.prompt({
        type: "list",
        name: "menuOption",
        message: "What would you like to do?",
        choices: [
            "Add departments, roles, employees",
            "View departments, roles, employees",
            "Update employee role",
            "Exit"
        ]

    }).then((answer) => {
        //Create a switch case to run different functions based on the user selection:
        switch(answer.menuOption){
            case "Add departments, roles, employees":
                addFunction();
                break;
            case "View departments, roles, employees":
                viewFunction();
                break;
            case "Update employee role":
                updateFunction();
                break;
            case "Exit":
                connection.end();
                break;
        }
    })
};

//Function that will handle the different switch cases for what the user wants to add to the database:
async function addFunction(){
    await inquirer.prompt([{
        type: "list",
        name: "adding",
        message: "What do you want to add?",
        choices: ["Department", "Role", "Employee"]
      }
    ]).then(({adding}) => {
        switch(adding){
            case "Department":
                addDept();
                break;
            case "Role":
                addRole();
                break;
            case "Employee":
                addEmployee();
                break;
            }
        }
    );
};

//Function that handles adding in a new department to the database:
async function addDept(){
    // prompt for info about the item being put up for auction
    await inquirer.prompt([
        {
          name: 'department_name',
          type: 'input',
          message: 'What is the Department name?',
        },
      ])
      .then((answer) => {
        // when finished prompting, insert a new item into the db with that info
        connection.query('INSERT INTO department SET ?', answer ,
          (err) => {
            if (err) throw err;
            console.log('Your Department was created successfully!');
            // re-prompt the user 
            start();
          }
        );
      });
  };


//Function to add the Role to the table:
async function addRole(){
  //First need to select the department table and display it, so the user has a reference for the department_id:
    connection.query("SELECT * FROM department", async function(err, res){
        if(err) throw err;

        let departments = res;
        console.log("-----REFERENCE TABLE-----".magenta);
        console.table(departments);
        //just doing res.id throws undefined. Need to specify the index of the value you are wanting to retrieve.
        // let deptid = res[0].id;
        // console.log(deptid);
        let depts = [];
        //need to create a loop, and push each item to an array in order to set it equal to a useable variable to use as the choices.
        for(i=0; i<res.length; i++){
          depts.push(res[i].id);
        };
        // console.log(depts);

        // Inside the first connection, begin to prompt the user for input about the role, and then add this to the role table:
    await inquirer.prompt([
        {
          name: 'title',
          type: 'input',
          message: 'What is the Role title?',
        },
        {
            name: 'salary',
            type: 'input',
            message: 'What is the salary for the Role?',
        },
        {
            name: 'department_id',
            type: 'list',
            message: 'What is the department the role is in?',
            choices: depts,
        },
      ])
      .then((answer) => {
        // when finished prompting, insert a new item into the db with that info. Can use just "answer" because the prompt names
        //match exacty with the db column names. Re-loops to the start menu of questions.
        connection.query('INSERT INTO role SET ?', answer ,
          (err) => {
            if (err) throw err;
            console.log('Your role was created successfully!');
            // re-prompt the user 
            start();
          }
        );
      });
    });
   
  };

//Function to add an employee to the database:
async function addEmployee(){
  //First select the role that the employee has, display the table so the user has a reference to role_id:
  connection.query("SELECT id, title, department_id FROM role", async function(err,res){
    if(err) throw err;

    let roleDisplay = res;
    console.log("-----REFERENCE TABLE-----".magenta);
    console.table(roleDisplay);

    let rolesid = [];
    for(i=0; i<res.length; i++){
      rolesid.push(res[i].id);
    };

    //Now have another connection.query to select all the managers and display/capture their ids:
    //Join the role and employee tables, and sort on manager role:
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee JOIN role ON (employee.role_id = role.id) WHERE (role.title = 'manager' OR role.title = 'Manager')",
      async function(err, res2){
        if(err) throw err;
        // console.log("Made it to the second query")

        let managerDisplay = res2;
        // console.log(res2);
        console.log("-----REFERENCE TABLE-----".magenta);
        console.table(managerDisplay);

        let managerid = [0];
        for(i=0; i<res2.length; i++){
          managerid.push(res2[i].id);
        }
        // console.log(managerid);

        //Prompt to add employees:
        await inquirer.prompt([
          {
            name: 'first_name',
            type: 'input',
            message: "What is the employee's first name?",
          },
          {
              name: 'last_name',
              type: 'input',
              message: "What is the employee's last name?",
          },
          {
              name: 'role_id',
              type: 'list',
              message: 'What role does this employee have? Choose the role id from the reference table above:',
              choices: rolesid,
          },
          {
            name: 'manager_id',
            type: 'list',
            message: "What manager does this employee have? Choose the manager's id or use 0 if no manager:",
            choices: managerid,
        },

        ]).then((answer) =>{
          connection.query("INSERT INTO employee SET ?", answer,
          (err) => {
            if (err) throw err;
            console.log('Your employee was created successfully!');
            // re-prompt the user 
            start();
           });
        });
      }    
    );
  });
};


//Create the main function that will allow a user to view the different tables:
async function viewFunction(){
  await inquirer.prompt([{
      type: "list",
      name: "viewing",
      message: "What do you want to view?",
      choices: ["Departments", "Roles", "Employees"]
    }
  ]).then(({viewing}) => {
      switch(viewing){
          case "Departments":
              connection.query("SELECT * FROM department", function(err,res){
                if(err) throw err;
                console.table(res);
                start();
              });
              break;
          case "Roles":
              connection.query("SELECT * FROM role JOIN department ON (role.department_id = department.id)", function(err,res){
                if(err) throw err;
                console.table(res);
                start();
              });
              break;
          case "Employees":
              connection.query("SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, role.title, department.department_name FROM employee JOIN role ON (employee.role_id = role.id) JOIN department ON (role.department_id = department.id)", 
              function(err,res){
                if(err) throw err;
                console.table(res);
                start();
              });
              break;
          }
      }
  );
};

//Create the main function where the employee's role can be updated:
async function updateFunction(){
  await inquirer.prompt([
    {
      name: 'last_name',
      type: 'input',
      message: "What is the employee's last name?",
  },
  ]).then((answer) => {
    // console.log(answer.last_name);
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, role.title FROM employee JOIN role ON (employee.role_id = role.id) WHERE ?",
    {last_name: answer.last_name}, function(err,res){
      
      if(err) throw err;
      //Display a table of all the employees with that last name, their unique id, and their current role for reference:
      console.log("-----EMPLOYEE REFERENCE TABLE-----".magenta);
      console.table(res);
      //Create an array to hold all the employee ids for the user to choose which one to change:
      let personid = [];
      for(i=0; i<res.length; i++){
        personid.push(res[i].id);
      }
      //Create a second connection to reference all available roles:
      connection.query("SELECT id, title, department_id FROM role", async function(err,res){
        if(err) throw err;

        let roleDisplay = res;
        console.log("-----ROLE REFERENCE TABLE-----".magenta);
        console.table(roleDisplay);

        //Create a second inquirer prompt to take in the id of the person to be updated:
        await inquirer.prompt([
          {
            name: 'id',
            type: 'list',
            message: "What is the employee's ID?",
            choices: personid,
          },
          {
            name: "role_id",
            type: "input",
            message: "What is the new role ID for this employee?"
          },
          ]).then((answer2) => {
            connection.query("UPDATE employee SET ? WHERE ?",[{role_id: parseInt(answer2.role_id)}, {id: parseInt(answer2.id)}], 
            async function(error, res){
              if(error) throw error;
              console.log("Employee Updated!");
              start();
            });
          });
      });
    });
  });

};


// connect to the mysql server and sql database
connection.connect((err) => {
    if (err) throw err;
    //Create the graphic for the main menu:
    console.log("--------".grey)
    console.log("Welcome!".magenta)
    console.log("--------".grey)
    // run the start function after the connection is made:
    start();
});