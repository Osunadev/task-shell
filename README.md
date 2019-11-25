# TASK-SHELL

This project aims to create a language composed of commands which allows to be able to **create lists of flexible tasks which can be downloaded in a convenient image format**.

As mentioned, with this tool we can create lists of dynamic tasks to which we can assign a title, description and the date on which it is planned to use that task list, as well as the tasks that make up that list, along with the estimated completion time.

> We have 3 types of commands: to **create**, **delete** and **modify** the **task list** and its respective **tasks**.

# TASK-SHELL COMMANDS

## IMPORTANT NOTES

- **task** and **task list** id's are purely numbers that aren't wrapped in any special symbols such as square brackets [] or quotes []. The **task-id's** and **tasklist-id's** start from number 1.
- Quotation marks **“** are used for descriptions of our tasks or task lists.
- Numbers are expressed without quotation marks, in addition to being used as id's, they are used for the **dates** of our **task lists** or for the estimated **time** in minutes of our **tasks**.

## COMMANDS

### TASK LIST

**CREATE TASK LIST**

    $ create tasklist [tasklist title]
    $ create tasklist [tasklist title] description “some tasklist descr.”
    $ create tasklist [tasklist title] date dd/mm/yyyy
    $ create tasklist [tasklist title] description “some tasklist descr.” date dd/mm/yyyy

**MODIFY TASK LIST**

    $ modify tasklist tasklist-id title [new tasklist name]
    $ modify tasklist tasklist-id description “new tasklist descr.”
    $ modify tasklist tasklist-id date dd/mm/yyyy
    $ modify tasklist tasklist-id title [new tasklist title] description “new tasklist descr.” date dd/mm/yyyy

**REMOVE TASK LIST**

    $ remove tasklist tasklist-id
    $ remove tasklist description tasklist-id
    $ remove tasklist date tasklist-id
    $ remove tasklist description date tasklist-id

---

### TASK

**CREATE TASK**

    $ create task [task title] from tasklist-id
    $ create task [task title] description “task descr.” from tasklist-id
    $ create task [task title] time estimated-time-minutes from tasklist-id
    $ create task [task title] description “task descr.” time estimated-time-minutes from tasklist-id

**MODIFY TASK**

    $ modify task task-id title [new task title] from tasklist-id
    $ modify task task-id description “new task descr.” from tasklist-id
    $ modify task task-id time new-estimated-time-minutes from tasklist-id
    $ modify task task-id title [new task title] description “new task descr.” time new-estimated-time-minutes from tasklist-id

**REMOVE TASK**

    $ remove task task-id from tasklist-id
    $ remove task time task-id  from tasklist-id
    $ remove task description  task-id from tasklist-id
    $ remove task description time task-id from tasklist-id

---

# COMMAND LANGUAGE TOKENS

The logic behind our Task-Shell is based on a simple Lexer, which is used to create tokens based on an input string provided by us. Below are the different types of tokens along with their associated values:

| Token Type          | Token Value                                                                                                      |
| ------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **StmtKeyboard**    | Can take the values ​​of **create**, **modify** and **remove**.                                                  |
| **ElmtKeyboard**    | Can take the values of **tasklist** and **task**.                                                                |
| **AttrKeyboard**    | Can take the values ​​of **description**, **date**, **time**, **title** and **form**.                            |
| **TitleText**       | Can take the value of any text string. It differs from other tokens because it is wrapped in square brackets []. |
| **DescriptionText** | Can take the value of any text string. It differs from other tokens because it is wrapped in quotes "".          |
| **DateFormat**      | Can take the value of any date with the format **dd/mm/yyyy**.                                                   |
| **Number**          | Can take the value of any number.                                                                                |

After the Lexing process, we will have our tokens at hand and, with these, we will pass them to the Parser so that it interprets the tokens along with its production rules and, at the end of the process, we return a new object according to our needs. In this case, we would return a new array of task lists to use it in React, our Frontend Library.
