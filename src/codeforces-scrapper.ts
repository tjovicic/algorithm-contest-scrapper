import * as rp from 'request-promise';
import * as cheerio from 'cheerio';

export default class CodeForcesScrapper {
    
    private _contestUrl: string;

    constructor(contestNumber) {
        this._contestUrl = 'http://codeforces.com/contest/' + contestNumber;
    }

    getProblems = async() => {
        const problemNames = await this.getProblemNames();
        
        const data = {};
        for (let i = 0; i < problemNames.length; i++) {
            const inOut = await this.getProblemInOut(problemNames[i]);
            data[problemNames[i]] = inOut;
        }

        return data;
    }

    getProblemNames = async() => {
        const options = {
            uri: this._contestUrl,
            transform: function (body) {
                return cheerio.load(body);
            }
        };

        try {
            const $ = await rp(options);
            let problems = [];
            const self = this;

            $('table[class="problems"] tbody').children().each(function(index, element) {
                let text = $(this).text().replace(/\s\s+/g, ' ').trim();
                if (!text.startsWith('#')) {
                    problems.push(text[0]);
                    // problems[text[0]] = this.getProblemInOut(text[0]);
                }
            });

            return problems; 
        } catch(err) {
            console.log(err);
        }
    }

    getProblemInOut = async(problem: string) => {
        const options = {
            uri: this._contestUrl + '/problem/' + problem,
            transform: function (body) {
                return cheerio.load(body);
            }
        };

        try {
            const $ = await rp(options);
            let data = [];
            let input: string;
            let output: string;
            let index = 0;

            $('div[class="sample-test"]').children().each(function(i, el) {
                let text = $(this).find('pre').html().replace(/<br>/g, '\n').trim();
                if (index % 2 === 0) {
                    input = text;
                } else {
                    output = text;
                    data.push([input, output]);
                }
                index++;
            });

            return data;
        } catch(err) {
            console.log(err);
        }
    }
}