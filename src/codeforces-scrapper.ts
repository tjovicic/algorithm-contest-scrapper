import * as rp from 'request-promise';
import * as cheerio from 'cheerio';
import Scrapper from './scrapper';

export default class CodeForcesScrapper extends Scrapper {
    url(): string {
        return "http://codeforces.com/contest/";
    }

    async getProblemNames(): Promise<string[]> {
        const options = {
            uri: this.contestUrl(),
            transform: function (body) {
                return cheerio.load(body);
            }
        };

        try {
            const $ = await rp(options);
            let problems: string[] = [];
            const self = this;

            $('table[class="problems"] tbody').children().each(function(index, element) {
                let text = $(this).text().replace(/\s\s+/g, ' ').trim();
                if (!text.startsWith('#')) {
                    problems.push(text[0]);
                }
            });

            return problems; 
        } catch(err) {
            console.log(err);
        }
    }

    async getProblemInOut(problem: string): Promise<[string, string][]> {
        const options = {
            uri: this.contestUrl() + '/problem/' + problem,
            transform: function (body) {
                return cheerio.load(body);
            }
        };

        try {
            const $ = await rp(options);
            let data: [string, string][] = [];
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