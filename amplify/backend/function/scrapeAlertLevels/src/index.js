/* Amplify Params - DO NOT EDIT
	API_COVIDDATAAPI_COUNCILTABLE_ARN
	API_COVIDDATAAPI_COUNCILTABLE_NAME
	API_COVIDDATAAPI_GRAPHQLAPIENDPOINTOUTPUT
	API_COVIDDATAAPI_GRAPHQLAPIIDOUTPUT
	API_COVIDDATAAPI_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const cheerio = require('cheerio');
const axios = require('axios');

const gql = require('graphql-tag');
const graphql = require('graphql');
const { print } = graphql;

const updateCouncil = gql`
    mutation updateCouncil($id: String!, $level: Int!) {
        updateCouncil(input: {id: $id, level: $level}) {
            id
            level
        }
    }
`
const db = API_COVIDDATAAPI_GRAPHQLAPIENDPOINTOUTPUT;
const key = process.env.API_COVIDDATAAPI_GRAPHQLAPIKEYOUTPUT;

const restrictions = 'https://www.gov.scot/publications/coronavirus-covid-19-protection-levels/';

exports.handler = async (event) => {

    var councils;
    var response = {
        statusCode: 200,
        body: JSON.stringify('Levels Scrapped and added to DynamoDB')
    };

    await axios.get(restrictions)
        .then(function(response) {
            
            console.log("Starting Scrape...");
            
            const $ = cheerio.load(response.data);
            councils = $('tbody tr').map(function(i, el){
                
                // Regex: Any chars at start of string, before a \n OR any digit after 3\sLevel\s
                const re = /^\D+(?=\n)|(?<=\s{3}Level\s)\d/g
                
                return $(this).text().trim().match(re);
            }).toArray();
            
            // Slice Table field
            councils = councils.slice(1);
            
            console.log("Scrapped Councils...");

        }).catch(function (error) {
            // handle error
            console.log(error);
        });

    // Horribly inefficent, batch job and building the json from the map would be better?
    for (let i=0; i < councils.length; i+=2){

        console.log("Sending councils to AppSync...");
        
        const graphqlData = await axios({
            url: db,
            method: 'post',
            headers: {
                'x-api-key': key
            },
            data: {
                query: print(updateCouncil),
                variables: {
                    id: councils[i].trim(),
                    level: councils[i+1]
                }
            }
        }).catch(function (error) {
            //TODO improve handling - GQL can silenty fail here
            console.log("Failed send to App sync");
            response = {
                statusCode: 500,
                body: error
            }
            throw error; 
        });
    }    

    return response;
};