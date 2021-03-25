const api = require("./api");

const apiLogin = process.env.ApiLogin;

const main = async () => {
  try {
    if (!apiLogin) {
      throw new Error("apiLogin not found");
    }
    const organizations = await fetchOrganizations();
    console.log(organizations);
  } catch (error) {
    console.error(error);
  }
};

/** 
  Получить список организаций
  @param {Array} organizationIds - список Ид организаций.
  @returns {Array} Организации
  */
const fetchOrganizations = async (organizationIds = ["*"]) => {
  try {
    const organizations = await api.post("/1/organizations", {
      organizationIds,
      returnAdditionalInfo: true,
      includeDisabled: true
    });
    return organizations;
  } catch (error) {
    throw new Error(error);
  }
};

main();
