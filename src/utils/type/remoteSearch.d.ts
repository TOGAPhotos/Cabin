export interface PhotoSearchResult extends PhotoInfo  {
    cn_name: string;
    iata: string;
    icao:string;
}
export type SearchType =  "reg"|"airline"|"airtype"|"airport"|"user";