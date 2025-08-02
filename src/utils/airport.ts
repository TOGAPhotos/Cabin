export default function formatAirportString({
  airport_cn: cnName,
  airport_icao_code: icao,
  airport_iata_code: iata,
}: {
  airport_cn?: string;
  airport_icao_code?: string;
  airport_iata_code?: string;
}): string {
  const airportCodes = [iata, icao].filter(Boolean).join("/") || "";
  if (!cnName) {
    return airportCodes;
  }
  if (!airportCodes) {
    return cnName;
  }
  return [airportCodes, cnName].filter(Boolean).join("-");
}
