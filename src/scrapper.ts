export default abstract class Scrapper {

    private _contestNumber: string;
    
    constructor(public contestNumber: string) {
        this._contestNumber = contestNumber;
    }

    abstract url(): string;

    contestUrl(): string {
        return this.url() + this.contestNumber;
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

    abstract getProblemNames(): Promise<string[]>;

    abstract getProblemInOut(problemName: string): Promise<[string, string][]>;

}