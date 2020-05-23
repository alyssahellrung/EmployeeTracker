USE company_db;

INSERT INTO department (name)
VALUES ("Marketing");

INSERT INTO department (name)
VALUES ("Finance");

INSERT INTO department (name)
VALUES ("Engineering");

INSERT INTO department (name)
VALUES ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 125000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Graphic Design Lead", 80000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 125000, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("Legal Counsel", 400000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jessica", "Anderson", 3, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Camille", "Patterson", 1, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Gretchen", "Hudson", 2, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES("Micah", "Zimmerman", 4, null);