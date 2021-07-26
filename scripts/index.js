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

const db = '<db-endpoint>';
const key = '<db-key>'
const restrictions = 'https://www.gov.scot/publications/coronavirus-covid-19-protection-levels/'

function scrape(){
    axios.get(restrictions)
        .then(function(response) {
            
            console.log("Starting Scrape...");
            
            const $ = cheerio.load(response.data);
            var councils = $('tbody tr').map(function(i, el){
                
                // Regex: Any chars at start of string, before a \n OR any digit after 3\sLevel\s
                const re = /^\D+(?=\n)|(?<=\s{3}Level\s)\d/g
                
                return $(this).text().trim().match(re);
            }).toArray();
            
            // Slice Table field
            councils = councils.slice(1);
            
            console.log("Scrapped Councils...");

            // Horribly inefficent, batch job and building the json from the map
            // for (let i=0; i < councils.length; i+=2){
            for (let i=0; i < councils.length; i+=2){

                console.log("Sending councils to AppSync...");
                
                const graphqlData = axios({
                    url: db,
                    method: 'post',
                    headers: {
                        'x-api-key': key
                    },
                    data: {
                        query: print(updateCouncil),
                        variables: {
                            id: councils[i].trim(),
                            level: 0
                        }
                    }
                }).then(function (response)
                {
                    console.log(response.data);
                }).catch(function (error) {
                    console.log("Failed send to App sync");
                    throw error; 
                });
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);

            return {
                statusCode: 500,
                body: JSON.stringify(error),
            };
        })
}

scrape();

