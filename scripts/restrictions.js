const cheerio = require('cheerio');
const axios = require('axios');

const gql = require('graphql-tag');
const graphql = require('graphql');
const { print } = graphql;

const updateRestrictions = gql`
    mutation createRestrictions($closed: String!, $open: String!, $overview: String!, $id: String!) {
        createRestrictions(input: {closed: $closed, open: $open, overview: $overview, id: $id}) {
          open
          closed
          overview
        }
      }
`
const db = '<db-endpoint>';
const key = '<key>'

const levels = ['https://www.gov.scot/publications/coronavirus-covid-19-protection-levels/pages/protection-level-0/', 
                        'https://www.gov.scot/publications/coronavirus-covid-19-protection-levels/pages/protection-level-1/',
                        'https://www.gov.scot/publications/coronavirus-covid-19-protection-levels/pages/protection-level-2/',
                        'https://www.gov.scot/publications/coronavirus-covid-19-protection-levels/pages/protection-level-3/',
                        'https://www.gov.scot/publications/coronavirus-covid-19-protection-levels/pages/protection-level-4/' 
                ];


function scrape(){
    for(let level = 0; level < levels.length; level++){
        axios.get(levels[level])
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
                }).then(function(response) {
                    console.log(response.data)
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
            });
    }
}

scrape();
