// Add environment default values for variables here
const _: { [key: string]: any } = {
  API_URL: "http://totalcoindesa.recuserver.com.ar/api",
  DECIDIR_API_URL: "https://developers.decidir.com/api/v2",
  AMBIENTE: "DESA",
};

// First searchs for variable definition in .env file. Is not found defaults to above values
const conf = (key: string): string => {
  const value: string | undefined = process.env[`REACT_APP_${key}`];
  if (!value) {
    return _[key];
  }
  return value;
};

export default conf;
