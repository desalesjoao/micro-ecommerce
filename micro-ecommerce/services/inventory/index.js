// importar a bibliooteca gRPC para noed.js
const grpc = require('@grpc/grpc-js');

//importar a biblioteca que carrega arquivos .proto (interface do serviço gRPC)
const protoloader = require('@grpc/proto-loader');

//importar a lista de protudos de um arquivo Json local)
const products = require('./products.json');

//carrega a definição do protocolo grpc do arquivo .proto)
const packageDefinition = protoloader.loadSync('proto/inventory.proto' , {
    keepCase: true, 
    longs: String,
    enums: String, 
    Arrays: true,
});

//constroi o objeto do pacote gRPC a partir da definição carregada 
const inventoryProto = grpc.loadPackageDefinition(packageDefinition);

//cria um novo dervifor gRPC 
const server = new grpc.Server();

//registrar o serviço inventoryService no servidor, implementação seus métodos 
server.addService(inventoryProto.inventoryService.service, {
    //implementação do metodo searchAllProducts 
    // esse meetodo ignora o request (_) e retorna a lista de produtos 
    searchAllProducts: (_,callback)=> {
        callback(null, {
            products: products, //retorna todos os produtos carregados do JSON 
        });
    },
});

//inicia o servidor gRPC na porta 3002 e exibe uma mensagem de status no console 
server.bindAsync('127.0.0.1:3002', grpc.ServerCredentials.createInsecure() , () => {
    console.log('Inventory service runnding at http://127.0.0.1:3002');
    server.star(); //inicia o servidor gRPC 
});