# About
Nodejs Express app on typescript 2
## Configs 
tsconfig.json
```
{ 
  "compilerOptions": { 
    "noImplicitAny": false, -- allow to use type 'any'
    "target": "es6", -- compile typescript code to es6 (some libs not support es5) 
    "module": "commonjs", -- system module
    "esModuleInterop": true, -- babel helper
    "allowSyntheticDefaultImports": true, -- allow default imports from modules with no default export
    "experimentalDecorators": true, -- allow experemental decorators
    "emitDecoratorMetadata": true, -- emit design-type metadata
    "outDir": "dist", -- output directory
    "sourceMap": false , -- disable sourcemaps 
    "lib": ["es5", "es6", "dom"], -- support libs
    "typeRoots": ["node_modules/@types"] -- path to types
  }, 
  "include": [ 
    "src/**/*.ts", -- project files
  ], 
  "exclude": [ 
    "node_modules" -- project libs
  ]
}
```
.env -- rename .env.development to .env
```
#Node environment
NODE_ENV=development
#Port to use
PORT=3000
#Custon field
NAME=KISKIN
#Database name (set mongo or psql)
DB_NAME=mongo
```
package.json scripts
```
  "scripts": {
    "tsc": "tsc", -- typescript compilator
    "dev": "ts-node-dev --respawn --transpileOnly ./src/index.ts", -- run app for development purposes. [ts-node-dev docs](https://github.com/whitecolor/ts-node-dev)
    "prod": "npm run build && node ./dist/index.js", -- run app for production purposes.
    "build": "gulp", -- build app using gulp
    "test-mongo": "NODE_ENV=test mocha dist/tests/unit/mongo/index.spec.js", -- run mongoose tests
    "test-psql": "NODE_ENV=test mocha dist/tests/unit/psql/index.spec.js" -- run sequelize tests
  }
```  
## Run commands
Create .env file and specify environment variables

To install this dependency use:

```
npm install
```
To run ther server in development mode:
```
npm run dev
```
To run ther server in development mode:
```
npm run prod
```
To run mongo tests
```
npm test-mongo
```
To run postgres tests
```
npm test-psql
```
## License

[MIT](LICENSE.md) &copy; [Kiskin Vladislav][author]


[author]: https://github.com/kiskinvlad
