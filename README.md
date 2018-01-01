# Sky price tracker

This project does regular price tracking and on-demand price tracking for airline tickets.

# Implementation Plan

* User insert the destination airport and the check-in, check-out date.
* Crawl data from the airline ticket information sites. (ex: Sky scanner, Naver flights, Expedia, ...)
* Save the results to database.
* Show the results to users.
* Draw graph to user interface from the database.

# How to

## User interface

* Homepage with AWS Lambda and Serverless framework.
* ReactJS (\*Not decided yet)
* Progress 0 / 10

## Crawling API

* AWS Lambda with Serverless Framework. HTTP Endpoint.
* Progress 0 / 10

## Regular Crawling

* Crawl skylines that user searched before.
* Use AWS Cloudwatch as Trigger crawling Lambda function.
* Progress 0 / 10

## Crawling

* Use PhantomJS to get JS rendering result. (I heard that I can use JS parser but I think it's too complex to use.)
* Progress 1 / 10

## Database

* Use DynamoDB with ORM(maybe Dynamo DB) - Not decided yet
* Progress 0 / 10

# Contribute

* Feel free to contribute this project. Just make Pull Request for me.
