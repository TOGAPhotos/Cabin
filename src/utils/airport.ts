export default function formatAirportString(cnName:string,icao:string,iata:string|null|undefined):string {
    if(iata){
        return `${iata}/${icao}-${cnName}`;
    }else{
        return `${icao}-${cnName}`;
    }
}