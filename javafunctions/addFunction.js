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
  password: 'unicorn',
  database: 'employee_trackerDB',
});

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

                break;
            case "Employee":

                break;



            }
        }
    );
};

async function addDept(){
    // prompt for info about the item being put up for auction
    await inquirer.prompt([
        {
          name: 'name',
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
            // start();
          }
        );
      });
  };

  // connect to the mysql server and sql database
connection.connect((err) => {
    if (err) throw err;
});

module.exports = addFunction;