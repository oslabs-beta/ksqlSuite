# ksqLight

<div align="center">
<img src="./src/static/ksqLight_name_2.png" alt="logo" width="400"/>
</div>

# About

ksqLight is an open-source tool for monitoring your ksqlDB queries and messages in real-time. Its interactive dashboard visualizes ksqlDB query and messages metrics, to help in diagnosing stream processing bottlenecks and identifying network issues.

Under the hood, it uses Prometheus to pull the relevant metrics from ksqlDB server.

# Features

![](./src/static/landing.gif)

## Metrics

Quickly toggle between query, message, and error pages.

![](./src/static/sidebar.gif)

## Dark Mode

![](./src/static/darkmode.gif)

## Submit SQL queries to ksqlDB server (in progress)

# Setup

> **Note**
> This app assumes you have access to a working ksqlDB server and a Prometheus instance scraping metrics from ksqlDB server via JMX exporter. If you need a reference on how to do that, please check out the `ksqLight/exampleContainers` folder.

## Clone repo, cd into it, then run:

```

npm run electron:serve

```

Upon startup, enter the Prometheus url into the pop-up (or you can enter it on the settings modal).

The duration and refresh rate for the time-series charts can be configured on the settings modal.

To submit SQL queries to ksqlDB server, the server url needs to be entered in settings.

![](./src/static/settings.gif)

# Developers

- Javan Ang - [GitHub](https://github.com/javanang) | [LinkedIn](https://www.linkedin.com/in/javanang/)
- Michael Snyder - [GitHub](https://github.com/MichaelCSnyder) | [LinkedIn](https://www.linkedin.com/in/michaelcharlessnyder/)
- Jonathan Luu - [GitHub](https://github.com/jonathanluu17) | [LinkedIn](https://www.linkedin.com/in/jonathanluu17/)
- Matthew Xing - [GitHub](https://github.com/matthewxing1) | [LinkedIn](https://www.linkedin.com/in/matthew-xing/)
- Gerry Bong - [GitHub](https://github.com/ggbong734) | [LinkedIn](https://www.linkedin.com/in/gerry-bong-71137420/)

# License

This product is licensed under the MIT License - see the LICENSE.md file for details.

This is an open source product.

This product is accelerated by OS Labs.

ksqlDB is licensed under the [Confluent Community License](https://github.com/confluentinc/ksql/blob/master/LICENSE).

_Apache, Apache Kafka, Kafka, and associated open source project names are trademarks of the [Apache Software Foundation](https://www.apache.org/)_.
