# Observability Documentation

This directory contains documentation for logging, monitoring, and APM (Application Performance Monitoring) in MyMindOS.

## Contents
- [Logging & APM Setup Guide](logging-apm-setup.md) - Complete setup and configuration
- [Logging Usage Guide](logging-usage.md) - How to use logging in your code
- [Custom Events Guide](custom-events.md) - Defining and using custom log events
- [New Relic APM Guide](newrelic-apm.md) - New Relic configuration and features

## Quick Links
- [Built-in Log Events](#built-in-log-events)
- [Custom Log Events](#custom-log-events)
- [Performance Monitoring](#performance-monitoring)
- [Error Tracking](#error-tracking)

## Overview

MyMindOS uses **Pino** for structured logging and **New Relic** for APM. The logging system is modular and provides:

- Structured JSON logging
- Automatic request/response logging
- Custom event tracking
- Performance metrics
- Error tracking with stack traces
- Integration with New Relic APM

## Architecture

```
LoggerService (Global)
├── Pino Logger (Structured JSON)
├── New Relic APM (Metrics & Events)
├── LoggingInterceptor (Auto HTTP logging)
└── HttpExceptionFilter (Error logging)
```

