var express = require('express'); // requisita a biblioteca para a criacao dos serviços web.
var pg = require("pg"); // requisita a biblioteca pg para a comunicacao com o banco de dados.

var sw = express(); // iniciliaza uma variavel chamada app que possitilitará a criação dos serviços e rotas.

sw.use(express.json());//padrao de mensagens em json.

sw.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET,POST');
    next();
});

const config = {
    host: 'localhost',
    user: 'postgres',
    database: 'db_cs_lpbd_2021_2',
    password: 'postgres',
    port: '5432'
} ;

//definia conexao com o banco de dados.
const postgres = new pg.Pool(config);

//definicao do primeiro serviço web.
sw.get('/', (req, res) => {
    res.send('Hello, world! meu primeiro teste.  #####');
})

sw.get('/listmodo', function (req, res) {

   //estabelece uma conexão com o bd.
    postgres.connect(function(err,client,done) {

       if(err){

           console.log("Não conseguiu acessar o BD :"+ err);
           res.status(400).send('{'+err+'}');
       }else{
        client.query('select codigo, to_char(datacriacao,\'yyyy-mm-dd\') as datacriacao, quantboots, quantrounds from tb_modo order by datacriacao asc;',function(err,result) {        
                done(); // closing the connection;
                if(err){
                    console.log(err);
                    res.status(400).send('{'+err+'}');
                }else{
                    res.status(200).send(result.rows);
                }
                
            });
       } 
    });
});


sw.get('/local', function (req, res) {

    //estabelece uma conexão com o bd.
     postgres.connect(function(err,client,done) {
 
        if(err){
 
            console.log("Não conseguiu acessar o BD :"+ err);
            res.status(400).send('{'+err+'}');
        }else{
         client.query('select codigo, nome, statuslocal from tb_local order by codigo asc;',function(err,result) {        
                 done(); // closing the connection;
                 if(err){
                     console.log(err);
                     res.status(400).send('{'+err+'}');
                 }else{
                     res.status(200).send(result.rows);
                 }
                 
             });
        } 
     });
 });

sw.listen(4000, function () {
    console.log('Server is running.. on Port 4000');
});
