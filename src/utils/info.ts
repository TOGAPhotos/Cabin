import ServerRequest from "./request";
export async function getAirportById(id:number){
    const airportInfoReq = new ServerRequest('GET', `/airport/${id}`);
    await airportInfoReq.send();
    return airportInfoReq.getData();
}