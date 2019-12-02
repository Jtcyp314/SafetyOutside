//node.js code
const {MongoClient} = require('mongodb');
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
            console.log(result);
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
        const insert =  client.db("WeatherData").collection("WeatherTest").insertOne(newListing);
        //console.log(newListing)
    }  

    catch (e) 
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
        // Connect to the MongoDB cluster
        await client.connect();

        await createListing(client)
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
