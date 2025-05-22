# Yajsb (Yet Another Jamstack Site Builder)

The project involves creating a static website generator using reusable components.
It's another Jamstack tool, but this one aim to be simple for devloppers and for final user with an web interface to change page data.
It doesn't use database, only json files.
This project aims to produce the lightest possible sites with good SEO capabilities and help developers to deliver a static website in the fastest way as possible.

## Architecture

* **lib**            : folder that contains built library

* **src/adapters**   : adapters for the different technologies used, such as files, server, and admin interface. All theses elements are thought to be replaced by others easily if you want to custom this project.
* **src/core**       : constants, basic functions for data and component management.
* **src/components** : definitions of reusable components, each with its own data schema and template. These are buil in component like header, image,  etc.
* **src/data**       : functions for data management, including reading and writing JSON files.
* **src/scripts**        : folder that contains script for automate some things like create quickly a component or register handmade components, etc.

* **templates**      : contains template for new page or new component

## Technologies

This is a typescript project, based on Bun for performances. It use Zod for defining and validate component data.

* **Bun**       : JavaScript runtime for code execution.
* **Zod**       : library for data validation and component definition.
* **TypeScript**: programming language for type definitions and code compilation.

## Roadmap

### v0
  The actual codebase : the project is in progress to check if the idea is good and if this tool can be used by a lot of developers.

### v1
  In its first release it will specialy thought for developers, not for agencies. It will provide a local-first approach : developments and updates could only be made in local way.

  The advantages of Local-First architecture:
  Resource optimization: By prioritizing data storage and processing on the user's device, Local-First applications are designed to be more resource-efficient.
  - Offline availability: Applications remain functional even without an internet connection, reducing the need for constant connectivity and bandwidth usage.
  - User data control: By storing data locally, users have greater control over their information.
  - Bandwidth minimization and reduced cloud dependency: By using caching as a performance lever, bandwidth is reduced and cloud dependency is reduced.

### v2
  This version will add the possibility to use the editor interface online. It will be thought for agency an their clients to update content of their static sites. One instance of the admin server will handle all filnal clients and websites in order to reduce ressources consumptions.
  It will add also some features to respond to basics needs like sending email, book a meeting and other stuff throught an API.


## Sonar Cloud evaluation

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_yajsb&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_yajsb)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_yajsb&metric=bugs)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_yajsb)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_yajsb&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_yajsb)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_yajsb&metric=coverage)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_yajsb)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_yajsb&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_yajsb)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_yajsb&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_yajsb)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_yajsb&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_yajsb)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_yajsb&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_yajsb)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_yajsb&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_yajsb)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_yajsb&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_yajsb)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_yajsb&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_yajsb)