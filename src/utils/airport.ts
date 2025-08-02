export default function formatAirportString({
  airport_cn: cnName,
  airport_icao_code: icao,
  airport_iata_code: iata,
}: {
  airport_cn?: string;
  airport_icao_code?: string;
  airport_iata_code?: string;
}): string {
  const enCode = [iata, icao].filter(Boolean).join("/") || "";
  if (!cnName) {
    return enCode;
  }
  if (!enCode) {
    return cnName;
  }
  return [enCode, cnName].filter(Boolean).join("-");
}
