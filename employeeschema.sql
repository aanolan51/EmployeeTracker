DROP DATABASE IF EXISTS employee_trackerDB;
CREATE database employee_trackerDB;

USE employee_trackerDB;
--This is the main/parent table. The id created here will need to be referenced in the other tables in order to link them--
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NULL,
  PRIMARY KEY (id)
);
--This table will still have it's own id, but will need to reference the id of the department the role will belong to.--
--department_id : INT to hold reference to department role belongs to--
--To do this, a FOREIGN KEY is used, setting the value of the department_id based on the referenced id that was created in the department table--
--"Foreign keys are what make it possible to join tables to each other." : Taken from https://www.springboard.com/blog/data-science/joining-data-tables/--
-- The reference for the foreign key is the id from the table named department.--
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NULL,
  salary DECIMAL NULL,
  department_id INT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES department(id)
);

--The employee table will need to reference the role that employee holds, so it will need to link to the role table via the role id--
--The employee table will also need to reference the manager that employee has. So it will need to reference the id given to another employee,
--that employee having the manager role designated to them. --
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NULL,
  last_name VARCHAR(30) NULL,
  role_id INT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);
