const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};


exports.createLookupObj = (dataArr, key, value) => {
  let lookupObj = {};
  dataArr.forEach((dataObject) => {
    lookupObj[dataObject[key]] = dataObject[value]
  });
  return lookupObj;
}

