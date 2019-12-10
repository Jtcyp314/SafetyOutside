
const {MongoClient} = require('mongodb');
const express = require('express');
const socketIO = require('socket.io');

/*const PORT =  process.env.PORT || 3000;
const INDEX = '/testSocket.html';

const server =  express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));*/





newListing = {"test" : "obj"};

async function listDatabases(client)
{
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function createNewListing()
{     

    var XMLHttpRequest = await require("xmlhttprequest").XMLHttpRequest;
    var xhr = await new XMLHttpRequest();
 
    await xhr.open("GET", 
        "https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/forecast?zip=11030&mode=json&appid=04e55ac87eaa2a6ec3b0fc7212888ebb", 
        false);
    await xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    //xhr.setRequestHeader('Access-Control-Allow-Origin','*')

    xhr.onreadystatechange = await function() 
    {

        try
        {

            result = xhr.responseText;
            info = JSON.parse(result)
            newListing = info
            //console.log(result);
            //console.log("try")
        }

        catch(e)
        {
            console.log("catch");
        }

  
      }

      await xhr.send();

};


async function createListing(client)
{
    try
    {
        await createNewListing();
        const insert = client.db("WeatherData").collection("WeatherTest").insertOne(newListing);
        //console.log(newListing)
    }  

    catch (e) 
    {
        console.error(e);
    }
};





async function sendListing(client, passedServer)
{
    try
    {
       const io = await socketIO(passedServer);
       const send = await client.db("WeatherData").collection("WeatherTest").findOne();
       io.on('connection', function (socket) 
       {
          socket.on('test', function (fn) 
          {
              stringToSend = JSON.stringify(send);
              //console.log(stringToSend);
              fn(stringToSend);
           });
        });

       console.log("send");
       //console.log(send);
       const del = await client.db("WeatherData").collection("WeatherTest").findOneAndDelete({}); 
    }

    catch(e)
    {
        console.error(e);    
    }
};


async function main()
{
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    const uri = "mongodb+srv://jtcyp314:COMP20Password@comp20final-zdrsz.mongodb.net/test?retryWrites=true&w=majority";

    const client = new MongoClient(uri);



    try 
    {

        const PORT =  await process.env.PORT || 3000;
        const INDEX = '/testSocket.html';

        const server =  await express()
          .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
          .listen(PORT, () => console.log(`Listening on ${PORT}`));
        // Connect to the MongoDB cluster
        await client.connect();

        await createListing(client)

        //make send listing function that uses testSocket.js to send data to client request
        await sendListing(client, server);
    } 

    catch (e) 
    {
        console.error(e);
    } 

    finally 
    {
        await client.close();
    }

};

main().catch(console.err);
