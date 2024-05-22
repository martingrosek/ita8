# ita8

1. localstack start -d
2. localstack status
3. aws --endpoint-url=http://localhost:4566 dynamodb create-table --table-name todo-list-system-todos --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 --region us-east-1
4. aws --endpoint-url=http://localhost:4566 s3api create-bucket --bucket todo-list-system-uploads --region us-east-1
5. serverless offline --stage local



1. http://localhost:3000/local/todos
{
  "task": "Sample Task"
}

1. http://localhost:3000/local/todos

1. http://localhost:3000/local/todos/{id}

http://localhost:3000/local/todos/{id}
{
  "task": "Updated Task",
  "completed": true
}


