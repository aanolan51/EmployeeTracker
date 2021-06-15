const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Enter your username:
  user: 'root',

  // Enter your password:
  password: '',
  database: 'employee_trackerDB',
});

function start(){
    inquirer.prompt({
        type: list,
        name: menuOption,
        message: "What would you like to do?",
        choices: [
            "Add departments, roles, employees",
            "View departments, roles, employees",
            "Update employee roles",
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
            case "Update employee roles":
                updateFunction();
                break;
            case "Exit":
                connection.end();
                break;
        }
    })
};

function addFunction(){

};


// connect to the mysql server and sql database
connection.connect((err) => {
    if (err) throw err;
    //Create the graphic for the main menu:
    console.log("Welcome!")
    // run the start function after the connection is made:
    start();
});