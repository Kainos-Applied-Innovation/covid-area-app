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

const updateRestrictions = gql`
    mutation updateRestrictions($closed: String!, $open: String!, $overview: String!, $id: String!) {
        updateRestrictions(input: {closed: $closed, open: $open, overview: $overview, id: $id}) {
          open
          closed
          overview
        }
      }
`
const db = process.env.API_COVIDDATAAPI_GRAPHQLAPIENDPOINTOUTPUT;
const key = process.env.API_COVIDDATAAPI_GRAPHQLAPIKEYOUTPUT;

const levels = ['https://www.gov.scot/publications/coronavirus-covid-19-protection-levels/pages/protection-level-0/', 
                        'https://www.gov.scot/publications/coronavirus-covid-19-protection-levels/pages/protection-level-1/',
                        'https://www.gov.scot/publications/coronavirus-covid-19-protection-levels/pages/protection-level-2/',
                        'https://www.gov.scot/publications/coronavirus-covid-19-protection-levels/pages/protection-level-3/',
                        'https://www.gov.scot/publications/coronavirus-covid-19-protection-levels/pages/protection-level-4/' 
                ];

exports.handler = async (event) => {

    for(let level = 0; level < levels.length; level++){
        await axios.get(levels[level])
            .then(function(response) {
            
                console.log("Scraping Level " + level.toString() + " restrictions...");
            
                const $ = cheerio.load(response.data);
                
                var restrictions = $('.body-content').children('ul').map(function(i, el){
                    return $(this).text().trim();
                }).toArray();

                console.log("Scrapped Restrictons...");

                const graphqlData = axios({
                    url: db,
                    method: 'post',
                    headers: {
                        'x-api-key': key
                    },
                    data: {
                        query: print(updateRestrictions),
                        variables: {
                            overview: restrictions[0],
                            open: restrictions[1],
                            closed: restrictions[2],
                            id: level.toString()
                        }
                    }
                })
                .catch(function (error) {
                    //TODO improve handling - GQL can silenty fail here
                    console.log("Failed send to App sync");
                    throw error; 
                });
            })
            .catch(function (error) {
                // handle error
                console.log(error);

                return {
                    statusCode: 500,
                    body: JSON.stringify(error),
                };
        });
    }
    
    return {
        statusCode: 200,
        body: JSON.stringify('Levels Scrapped and added to DynamoDB'),
    };;
};