'use strict';

const AWS = require('aws-sdk');
const uuid = require('uuid');

const docClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'http://127.0.0.1:4566', // Localstack DynamoDB endpoint
  region: 'us-east-1'
});

const TABLE_NAME = process.env.TODOS_TABLE;

// Create Todo
module.exports.createTodo = async (event) => {
  console.log('createTodo function invoked');
  try {
    const { task } = JSON.parse(event.body);
    console.log('Parsed task:', task);
    const id = uuid.v4();
    const newTodo = { id, task, completed: false };
    console.log('New Todo:', newTodo);
    await docClient.put({
      TableName: TABLE_NAME,
      Item: newTodo
    }).promise();
    console.log('Todo successfully saved');
    return {
      statusCode: 201,
      body: JSON.stringify(newTodo)
    };
  } catch (error) {
    console.error('Error in createTodo:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

// Get All Todos
module.exports.getTodos = async () => {
  console.log('getTodos function invoked');
  try {
    const data = await docClient.scan({ TableName: TABLE_NAME }).promise();
    console.log('Fetched Todos:', data.Items);
    return {
      statusCode: 200,
      body: JSON.stringify(data.Items)
    };
  } catch (error) {
    console.error('Error in getTodos:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

// Get Todo by ID
module.exports.getTodoById = async (event) => {
  console.log('getTodoById function invoked');
  try {
    const { id } = event.pathParameters;
    console.log('Fetching Todo with ID:', id);
    const data = await docClient.get({
      TableName: TABLE_NAME,
      Key: { id }
    }).promise();
    if (!data.Item) {
      console.log('Todo not found with ID:', id);
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Todo not found' })
      };
    }
    console.log('Fetched Todo:', data.Item);
    return {
      statusCode: 200,
      body: JSON.stringify(data.Item)
    };
  } catch (error) {
    console.error('Error in getTodoById:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

// Update Todo
module.exports.updateTodo = async (event) => {
  console.log('updateTodo function invoked');
  try {
    const { id } = event.pathParameters;
    const { task, completed } = JSON.parse(event.body);
    console.log('Updating Todo with ID:', id);
    await docClient.update({
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: 'set task = :task, completed = :completed',
      ExpressionAttributeValues: {
        ':task': task,
        ':completed': completed
      }
    }).promise();
    console.log('Todo successfully updated with ID:', id);
    return {
      statusCode: 200,
      body: JSON.stringify({ id, task, completed })
    };
  } catch (error) {
    console.error('Error in updateTodo:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

// Delete Todo
module.exports.deleteTodo = async (event) => {
  console.log('deleteTodo function invoked');
  try {
    const { id } = event.pathParameters;
    console.log('Deleting Todo with ID:', id);
    await docClient.delete({
      TableName: TABLE_NAME,
      Key: { id }
    }).promise();
    console.log('Todo successfully deleted with ID:', id);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Todo deleted successfully' })
    };
  } catch (error) {
    console.error('Error in deleteTodo:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
